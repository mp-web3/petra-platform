/**
 * StripeController
 * 
 * Handles all Stripe webhook events and processes checkout completions.
 * 
 * Main responsibilities:
 * - Verifies webhook signatures from Stripe
 * - Processes checkout.session.completed events
 * - Creates/updates users, orders, subscriptions, and consent records
 * - Sends transactional emails (order confirmation, account activation)
 * 
 * Important: This controller uses raw body parsing for webhook signature verification.
 * See main.ts for express.raw() middleware configuration.
 */
import { Controller, Post, Req, Res, HttpStatus } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { StripeService } from './stripe.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { AuthService } from '../auth/auth.service';
import { SubscriptionService } from '../subscription/subscription.service';

/**
 * Controller endpoint: /api/stripe
 * All routes under this controller will be prefixed with /api/stripe
 */
@Controller('api/stripe')
export class StripeController {
    /**
     * Dependency Injection
     * 
     * @param stripeService - Service for Stripe API operations (creating sessions, verifying webhooks)
     * @param prisma - Prisma ORM service for database operations
     * @param emailService - Service for sending emails via Resend and logging email status
     * @param authService - Service for secure token generation and account activation
     * @param subscriptionService - Service for subscription management operations
     */
    constructor(
        private readonly stripeService: StripeService,
        private readonly prisma: PrismaService,
        private emailService: EmailService,
        private authService: AuthService,
        private subscriptionService: SubscriptionService
    ) { }

    /**
     * Maps planId string to SubscriptionPlanType enum value
     * 
     * This helper method converts plan identifiers from Stripe metadata
     * (e.g., "woman-starter-6w", "man-premium-18w") into database enum values.
     * 
     * Supported plan formats:
     * - woman-starter-6w / coaching-donna-starter → WOMAN_STARTER
     * - woman-premium-18w / coaching-donna-premium → WOMAN_PREMIUM
     * - man-starter-36w / uomo-starter → MAN_STARTER
     * - man-premium-6w / uomo-premium → MAN_PREMIUM
     * 
     * @param planId - The plan identifier from Stripe session metadata or order record
     * @returns SubscriptionPlanType enum value matching the plan
     * 
     * Note: Currently defaults to WOMAN_STARTER for unknown formats.
     * Consider throwing an error in production to catch invalid plan IDs early.
     * 
     * 
     */
    private mapPlanIdToPlanType(planId: string): 'WOMAN_STARTER' | 'WOMAN_PREMIUM' | 'MAN_STARTER' | 'MAN_PREMIUM' {
        // Normalize to lowercase for case-insensitive matching
        // Handles variations like "Woman-Starter", "woman-starter", etc.
        const normalized = planId.toLowerCase();

        // Check for woman/coaching-donna plans (Italian: "donna" = woman)
        if (normalized.includes('woman') || normalized.includes('coaching-donna')) {
            // Determine if it's premium or starter tier
            return normalized.includes('premium') ? 'WOMAN_PREMIUM' : 'WOMAN_STARTER';
        }
        // Check for man/uomo plans (Italian: "uomo" = man)
        else if (normalized.includes('man') || normalized.includes('uomo')) {
            // Determine if it's premium or starter tier
            return normalized.includes('premium') ? 'MAN_PREMIUM' : 'MAN_STARTER';
        }

        // Default fallback for unknown plan formats
        // TODO: Consider throwing an error in production instead of defaulting
        // This helps catch invalid plan IDs during development/testing
        console.warn(`⚠️  Unknown planId format: ${planId}, defaulting to WOMAN_STARTER`);
        return 'WOMAN_STARTER';
    }

    /**
     * Extracts duration from planId and maps it to PlanDuration enum
     * 
     * This helper method parses the duration component from plan identifiers
     * (e.g., "woman-starter-6w", "man-premium-18w") and converts it to enum values.
     * 
     * Supported duration formats:
     * - "6w", "6" → WEEKS_6
     * - "18w", "18" → WEEKS_18
     * - "36w", "36" → WEEKS_36
     * 
     * @param planId - The plan identifier containing duration info (e.g., "woman-starter-6w")
     * @returns PlanDuration enum value (defaults to WEEKS_6 if not found)
     * 
     * Note: The method checks for both "18w" and "18" patterns to handle variations
     * in how plan IDs are formatted.
     */
    private mapPlanIdToDuration(planId: string): 'WEEKS_6' | 'WEEKS_18' | 'WEEKS_36' {
        // Normalize to lowercase for case-insensitive matching
        const normalized = planId.toLowerCase();

        // Check for 36 weeks duration (longest option)
        // Handles both "36w" and "36" formats
        if (normalized.includes('36w') || normalized.includes('36')) {
            return 'WEEKS_36';
        }
        // Check for 18 weeks duration (medium option)
        // Handles both "18w" and "18" formats
        else if (normalized.includes('18w') || normalized.includes('18')) {
            return 'WEEKS_18';
        }
        // Default to 6 weeks (shortest option)
        // This is the most common duration, so it's safe to default
        else {
            return 'WEEKS_6';
        }
    }

    /**
     * Processes a completed Stripe checkout session
     * 
     * This method orchestrates the entire post-checkout flow:
     * 1. User management (create new or update existing)
     * 2. Order creation
     * 3. Consent recording (if metadata available)
     * 4. Order confirmation email
     * 5. Account activation email (new users only)
     * 
     * This is called automatically when a checkout.session.completed webhook is received.
     * 
     * @param session - The Stripe checkout session object from webhook event
     *                  Contains: customer email, metadata, payment details, etc.
     * 
     * Important: This method uses graceful error handling for emails - if email sending
     * fails, the webhook still succeeds (order is already created). This prevents
     * webhook retries due to transient email service issues.
     */
    private async handleCheckoutCompleted(session: any) {
        // ============================================================
        // STEP 0: Extract and validate customer email
        // ============================================================
        // Stripe provides email in two possible locations:
        // 1. session.customer_email (direct field, available for guest checkouts)
        // 2. session.customer_details?.email (nested in customer_details object)
        // 
        // We check both because Stripe CLI test webhooks often use customer_details.email
        // while production webhooks might use customer_email directly.
        const customerEmail = session.customer_email || session.customer_details?.email;
        console.log('🔄 Processing checkout for:', customerEmail)

        // Early return if no email found - can't proceed without customer email
        // This prevents creating orders without user association
        if (!customerEmail) {
            console.log('⚠️  No customer email in session, skipping user creation');
            return;
        }

        // ============================================================
        // STEP 1: User Management
        // ============================================================
        // Check if user already exists by email (supports guest checkout flow)
        // In Stripe, customers can checkout without creating an account first
        let user = await this.prisma.user.findUnique({
            where: { email: customerEmail }
        })

        // Flag to track if this is a new user (affects whether we send activation email)
        let isNewUser = false;

        if (!user) {
            // ============================================================
            // New User Path: Create user account (guest checkout)
            // ============================================================
            console.log('➕ Creating new user (guest checkout)')
            isNewUser = true;

            // Create user with minimal required data
            // Note: No password is set here - user will set password via activation link
            user = await this.prisma.user.create({
                data: {
                    email: customerEmail,
                    stripeCustomerId: session.customer, // Link to Stripe customer
                    role: 'CLIENT',
                    emailVerified: false,
                }
            })
            console.log('✅ User created:', user.id);
        } else {
            // ============================================================
            // Existing User Path: Update if needed
            // ============================================================
            console.log('👤 User already exists:', user.id);

            // Update Stripe customer ID if missing or different (sync existing users with Stripe)
            // This handles cases where:
            // 1. User was created before linking to Stripe (missing customer ID)
            // 2. Stripe created a new customer ID for this session (different customer ID)
            // 
            // Note: stripeCustomerId is @unique, so if session.customer is already
            // used by another user, this update will fail (which is correct behavior)
            if (!user.stripeCustomerId || user.stripeCustomerId !== session.customer) {
                try {
                    await this.prisma.user.update({
                        where: { id: user.id },
                        data: { stripeCustomerId: session.customer }
                    })
                    console.log('✅ Stripe customer ID updated:', session.customer);
                } catch (error: any) {
                    // Handle case where session.customer is already used by another user
                    // This shouldn't happen in normal flow, but log it for investigation
                    console.warn('⚠️  Failed to update Stripe customer ID:', error.message);
                    // Don't throw - continue processing the checkout
                }
            }
        }

        // ============================================================
        // STEP 2: Create Order Record
        // ============================================================
        // Create order record to track the purchase
        // This order will be used later when subscription is created
        const order = await this.prisma.order.create({
            data: {
                userId: user.id, // Link to the user who made the purchase

                // Plan ID from Stripe session metadata (set during checkout creation)
                // Fallback to 'test-plan' if missing (handles test webhooks)
                // TODO: Consider validation - should we fail if planId is missing?
                planId: session.metadata?.planId || 'test-plan',

                // Amount in smallest currency unit (cents for EUR/USD)
                // Example: €29.99 → 2999
                amount: session.amount_total,

                // Currency code (e.g., 'eur', 'usd')
                currency: session.currency,

                // Order status: COMPLETED (payment was successful)
                status: 'COMPLETED',

                // Stripe identifiers for linking back to Stripe objects
                stripeSessionId: session.id, // Unique checkout session ID
                stripePaymentIntentId: session.payment_intent // Payment intent ID (nullable)
            }
        })
        console.log('📦 Order created:', order.id);

        // ============================================================
        // STEP 3: Record User Consent (GDPR/Legal Compliance)
        // ============================================================
        // Create consent record only if metadata exists
        // This is optional - some checkouts (especially test ones) may not include consent data
        // 
        // Important: We only create consent if tosAccepted is explicitly 'true'
        // This ensures we have proof of consent before recording it
        if (session.metadata && session.metadata.tosAccepted === 'true') {
            await this.prisma.consent.create({
                data: {
                    orderId: order.id, // Link consent to the specific order

                    // Consent flags - converted from string 'true'/'false' to boolean
                    // These are stored as strings in Stripe metadata
                    tosAccepted: session.metadata.tosAccepted === 'true',
                    privacyAccepted: session.metadata.privacyAccepted === 'true',
                    marketingOptIn: session.metadata.marketingOptIn === 'true',

                    // Version tracking for legal compliance
                    // Allows tracking which version of ToS/Privacy policy user accepted
                    // Defaults to 'v1.0' if not provided (handles legacy checkouts)
                    disclosureTosVersion: session.metadata.tosVersion || 'v1.0',
                    disclosurePrivacyVersion: session.metadata.privacyVersion || 'v1.0',

                    // User context for audit trail (optional)
                    ipAddress: session.metadata.ipAddress || null, // User's IP when consenting
                    userAgent: session.metadata.userAgent || null, // Browser/device info
                }
            })
            console.log('✅ Consent recorded');
        } else {
            // No consent metadata - skip recording (acceptable for test webhooks)
            // In production, all checkouts should include consent metadata
            console.log('⚠️  No consent metadata found, skipping consent record');
        }

        // ============================================================
        // STEP 4: Send Order Confirmation Email
        // ============================================================
        // Send transactional email confirming the order
        // EmailService automatically logs the email attempt in EmailLog table
        // 
        // Important: Email failures don't fail the webhook - order is already created
        // This prevents webhook retries due to transient email service issues
        const confirmationResult = await this.emailService.sendOrderConfirmation(
            customerEmail, // Recipient email address
            order.id, // Pass orderId (used for email log tracking and email content)
            session.metadata?.planId || 'test-plan', // Plan identifier for email content
            session.amount_total, // Order amount in cents (displayed as currency in email)
            session.currency // Currency code (e.g., 'eur')
        );

        // Check result and log appropriately
        // EmailService returns { success: boolean, emailLogId?: string, errorMessage?: string }
        if (confirmationResult.success) {
            console.log('✅ Order confirmation email sent and logged:', confirmationResult.emailLogId);
        } else {
            // Email failed but webhook continues - order is still valid
            console.error('⚠️  Order confirmation email failed:', confirmationResult.errorMessage);
            // Note: The email log entry will have status='FAILED' for tracking
        }

        // ============================================================
        // STEP 5: Send Account Activation Email (New Users Only)
        // ============================================================
        // Only send activation email to new users
        // Existing users already have accounts, so they just get order confirmation
        if (isNewUser) {
            console.log('📧 New user - sending account activation email');

            // Generate secure activation token using AuthService
            // This creates a cryptographically secure random token (256 bits)
            // and stores it in the database with expiration (7 days)
            // Token is stored in ActivationToken table for validation
            const activationToken = await this.authService.generateActivationToken(user.id);

            // Send activation email with link to set password
            // Email contains link: /activate?token={token}&userId={userId}
            const activationResult = await this.emailService.sendAccountActivation(
                customerEmail, // Recipient
                user.id, // User ID for activation link
                activationToken, // Secure token for password setup
                order.id // Link email to order (for tracking) - optional
            );

            // Check result and log
            if (activationResult.success) {
                console.log('✅ Account activation email sent and logged:', activationResult.emailLogId);
            } else {
                // Email failed but webhook continues - user can request new activation link later
                console.error('⚠️  Account activation email failed:', activationResult.errorMessage);
                // Note: Token is still valid - user can request resend of email
                // TODO: Implement resend activation email endpoint
            }
        } else {
            // Existing user path - they already have account, no activation needed
            console.log('📧 Existing user - order confirmation email sent');
        }

        // All steps completed successfully
        console.log('🎉 Checkout processing complete!');
    }

    /**
     * Webhook Endpoint: POST /api/stripe/webhook
     * 
     * Main entry point for all Stripe webhook events.
     * 
     * Security:
     * - Verifies Stripe signature to ensure request is from Stripe
     * - Uses raw body (Buffer) for signature verification (required by Stripe)
     * - Returns 200 on success (Stripe stops retrying)
     * - Returns 400 on error (Stripe will retry)
     * 
     * Important: This endpoint must use raw body parsing (see main.ts express.raw() config).
     * NestJS default JSON parsing breaks signature verification.
     * 
     * Supported Events:
     * - checkout.session.completed: Processes checkout, creates user/order
     * - customer.subscription.created: Creates subscription record
     * - customer.subscription.updated: (TODO - not implemented)
     * - customer.subscription.deleted: (TODO - not implemented)
     * - payment_intent.succeeded: (Logged only - no action)
     * - All other events: Logged but not handled
     */
    @Post('webhook')
    @SkipThrottle() // Skip rate limiting for Stripe webhooks (trusted source)
    async handleWebhook(@Req() req: Request, @Res() res: Response) {
        // ============================================================
        // Step 1: Extract and validate Stripe signature
        // ============================================================
        // Stripe sends webhook signature in 'stripe-signature' header
        // This signature is required to verify the request is from Stripe
        // and hasn't been tampered with
        const signature = req.headers['stripe-signature'];

        // Validate signature exists and is a string
        // Reject requests without signature (security requirement)
        if (!signature || typeof signature !== 'string') {
            return res.status(HttpStatus.BAD_REQUEST).send('Missing signature');
        }

        try {
            // ============================================================
            // Step 2: Verify webhook signature and parse event
            // ============================================================
            // Stripe requires RAW body (not parsed JSON) for signature verification
            // The body must be a Buffer, not a JavaScript object
            // This is why we use express.raw() middleware in main.ts
            const rawBody = req.body as Buffer;

            // Verify signature and parse webhook event
            // This throws an error if signature is invalid
            // constructWebhookEvent() uses STRIPE_WEBHOOK_SECRET from environment
            const event = await this.stripeService.constructWebhookEvent(
                rawBody,
                signature
            );

            // Log received event type for debugging
            console.log('📨 Stripe webhook received:', event.type);

            // ============================================================
            // Step 3: Route event to appropriate handler
            // ============================================================
            // Switch statement routes different event types to handlers
            // Each event type has specific processing logic
            switch (event.type) {
                /**
                 * Event: checkout.session.completed
                 * 
                 * Link: https://docs.stripe.com/api/events/types?api-version=2025-08-27.basil#event_types-checkout.session.completed
                 * 
                 * Fired when: Customer successfully completes checkout
                 * Timing: After payment is confirmed, before subscription is created
                 * 
                 * This is the main event that triggers the entire order flow:
                 * - User creation/update
                 * - Order creation
                 * - Consent recording
                 * - Email sending
                 */
                case 'checkout.session.completed': {
                    // Extract checkout session object from event data
                    const session = event.data.object as any;
                    console.log('✅ Checkout completed:', session.id);

                    // Process the checkout (user, order, consent, emails)
                    // This is the main orchestration method
                    await this.handleCheckoutCompleted(session);
                    break;
                }

                /**
                 * Event: payment_intent.succeeded
                 * 
                 * Fired when: Payment is successfully processed
                 * Timing: Usually before checkout.session.completed
                 * 
                 * Note: Currently just logged - no action needed
                 * The checkout.session.completed event is more comprehensive
                 * and contains all the data we need
                 */
                case 'payment_intent.succeeded': {
                    const paymentIntent = event.data.object as any;
                    console.log('💰 Payment succeeded:', paymentIntent.id);
                    // No action needed - checkout.session.completed handles everything
                    break;
                }

                /**
                 * Event: customer.subscription.created
                 * 
                 * Fired when: Subscription is created in Stripe
                 * Timing: After checkout.session.completed (for subscription checkouts)
                 * 
                 * This event creates the subscription record in our database.
                 * The subscription is linked to the user and order from checkout.
                 * 
                 * Important: We find the order by matching Stripe customer ID to user,
                 * then finding their most recent completed order. This works because:
                 * 1. checkout.session.completed fires first and creates the order
                 * 2. customer.subscription.created fires shortly after
                 * 3. We use the most recent order (orderBy createdAt desc)
                 * 
                 * TODO: Consider storing checkoutSessionId in subscription metadata
                 * for more reliable order matching (handles edge cases with multiple orders)
                 */
                case 'customer.subscription.created': {
                    const subscription = event.data.object as any;
                    console.log('📋 Subscription created:', subscription.id);

                    // Extract Stripe customer ID from subscription
                    // This is the key we use to find the associated user
                    const customerId = subscription.customer;

                    if (customerId) {
                        // ============================================================
                        // Step 3.1: Find user by Stripe customer ID
                        // ============================================================
                        // The user was created/updated in handleCheckoutCompleted()
                        // with stripeCustomerId set to session.customer
                        const user = await this.prisma.user.findUnique({
                            where: { stripeCustomerId: customerId }
                        });

                        if (user) {
                            // ============================================================
                            // Step 3.2: Find associated order
                            // ============================================================
                            // Find the most recent completed order for this user
                            // We use "most recent" because:
                            // - Multiple orders might exist (though rare)
                            // - checkout.session.completed fires first, so order should be recent
                            // - We can't use checkoutSessionId from metadata (not stored)
                            const order = await this.prisma.order.findFirst({
                                where: {
                                    userId: user.id, // Link to user
                                    status: 'COMPLETED' // Only completed orders
                                },
                                orderBy: {
                                    createdAt: 'desc' // Most recent first
                                }
                            });

                            if (order) {
                                // ============================================================
                                // Step 3.3: Create subscription record
                                // ============================================================
                                await this.prisma.subscription.create({
                                    data: {
                                        userId: user.id, // Link to user

                                        // Map planId from order to enum values
                                        // These helper methods parse planId like "woman-starter-6w"
                                        planType: this.mapPlanIdToPlanType(order.planId),
                                        duration: this.mapPlanIdToDuration(order.planId),

                                        // Subscription status - newly created subscriptions are active
                                        status: 'ACTIVE',

                                        // Stripe subscription identifiers
                                        stripeSubscriptionId: subscription.id, // Stripe subscription ID

                                        // Subscription period dates
                                        // Stripe uses Unix timestamps (seconds), JS Date uses milliseconds
                                        // Multiply by 1000 to convert seconds → milliseconds
                                        currentPeriodStart: new Date(subscription.current_period_start * 1000),
                                        currentPeriodEnd: new Date(subscription.current_period_end * 1000),

                                        // Cancellation flag (if user cancelled but subscription continues until period end)
                                        cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
                                    }
                                });
                                console.log('✅ Subscription record created for user:', user.id);
                            } else {
                                // Order not found - this shouldn't happen in normal flow
                                // But we log it instead of throwing to prevent webhook retries
                                console.warn('⚠️  No order found for subscription:', subscription.id);
                            }
                        } else {
                            // User not found - subscription created but user doesn't exist yet
                            // This could happen if events arrive out of order (rare)
                            console.warn('⚠️  No user found for customer:', customerId);
                        }
                    } else {
                        // No customer ID - invalid subscription object
                        console.warn('⚠️  No customer ID in subscription:', subscription.id);
                    }
                    break;
                }
                /**
                 * Event: customer.subscription.updated
                 * 
                 * Fired when: Subscription is updated (plan change, status change, renewal, etc.)
                 * 
                 * This keeps our database in sync with Stripe subscription changes.
                 */
                case 'customer.subscription.updated': {
                    const subscription = event.data.object as any;
                    console.log('📋 Subscription updated:', subscription.id);

                    // Sync subscription status from Stripe
                    // This updates status, dates, and cancellation flag in our database
                    await this.subscriptionService.handleSubscriptionUpdated(subscription.id);
                    console.log('✅ Subscription synced in database');
                    break;
                }

                /**
                 * Event: customer.subscription.deleted
                 * 
                 * Fired when: Subscription is cancelled and deleted in Stripe
                 * 
                 * This marks the subscription as CANCELLED in our database.
                 */
                case 'customer.subscription.deleted': {
                    const subscription = event.data.object as any;
                    console.log('📋 Subscription deleted:', subscription.id);

                    // Mark subscription as cancelled in database
                    await this.subscriptionService.handleSubscriptionDeleted(subscription.id);
                    console.log('✅ Subscription marked as cancelled');
                    break;
                }

                /**
                 * Default case: Unhandled event types
                 * 
                 * Stripe sends many event types. We only handle the ones we need.
                 * Unhandled events are logged for visibility but don't cause errors.
                 * 
                 * Common unhandled events you might see:
                 * - product.created, price.created (when setting up Stripe)
                 * - charge.succeeded, charge.updated (payment details)
                 * - invoice.paid (invoice processing)
                 */
                default:
                    console.log('ℹ️  Unhandled event type:', event.type);
            }

            // ============================================================
            // Step 4: Return success response
            // ============================================================
            // Return 200 with { received: true } to tell Stripe we processed the event
            // Stripe will stop retrying if it gets a 200 response
            // Any non-200 response causes Stripe to retry the webhook
            return res.json({ received: true });

        } catch (err) {
            // ============================================================
            // Error Handling
            // ============================================================
            // Catch any errors (signature verification, database errors, etc.)
            // Log the error for debugging
            console.error('❌ Webhook error:', err);

            // Return 400 to indicate webhook failed
            // Stripe will retry the webhook if it gets a non-200 response
            // Generic error message to avoid leaking internal details
            return res.status(HttpStatus.BAD_REQUEST).send('Invalid signature');
        }
    }
}
