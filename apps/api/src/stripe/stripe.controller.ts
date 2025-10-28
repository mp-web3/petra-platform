import { Controller, Post, Req, Res, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './stripe.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/stripe')
export class StripeController {
    constructor(
        private readonly stripeService: StripeService,
        private readonly prisma: PrismaService
    ) { }

    private async handleCheckoutCompleted(session: any) {
        console.log('🔄 Processing checkout for:', session.customer_email)

        // 1. Check if user already exists
        let user = await this.prisma.user.findUnique({
            where: { email: session.customer_email }
        })

        let isNewUser = false;

        if (!user) {
            console.log('➕ Creating new user (guest checkout)')
            isNewUser = true;
            user = await this.prisma.user.create({
                data: {
                    email: session.customer_email,
                    stripeCustomerId: session.customer,
                    role: 'CLIENT',
                    // No password yet - will be set when they activate account
                }
            })
            console.log('✅ User created:', user.id);
        } else {
            console.log('👤 User already exists:', user.id);

            // Update Stripe customer ID if missing
            if (!user.stripeCustomerId) {
                await this.prisma.user.update({
                    where: { id: user.id },
                    data: { stripeCustomerId: session.customer }
                })
                console.log('✅ Stripe customer ID updated');
            }
        }

        // 2. Create order record
        const order = await this.prisma.order.create({
            data: {
                userId: user.id,
                planId: session.metadata.planId,
                amount: session.amount_total,
                currency: session.currency,
                status: 'COMPLETED',
                stripeSessionId: session.id,
                stripePaymentIntentId: session.payment_intent
            }
        })
        console.log('📦 Order created:', order.id);

        // 3. Create consent record
        if (session.metadata.tosAccepted === 'true') {
            await this.prisma.consent.create({
                data: {
                    orderId: order.id,
                    tosAccepted: session.metadata.tosAccepted === 'true',
                    privacyAccepted: session.metadata.privacyAccepted === 'true',
                    marketingOptIn: session.metadata.marketingOptIn === 'true',
                    disclosureTosVersion: session.metadata.tosVersion || 'v1.0',
                    disclosurePrivacyVersion: session.metadata.privacyVersion || 'v1.0',
                    ipAddress: session.metadata.ipAddress || null,
                    userAgent: session.metadata.userAgent || null,
                }
            })
            console.log('✅ Consent recorded');
        }

        // 4. Send account activation email (if new user)
        if (isNewUser) {
            // TODO: Implement email service
            console.log('📧 Would send activation email to:', user.email);
            console.log('   → User should set password and activate account');
            // await this.emailService.sendAccountActivation(user.email, user.id);
        } else {
            // Existing user - send order confirmation
            console.log('📧 Would send order confirmation to:', user.email);
            // await this.emailService.sendOrderConfirmation(user.email, order.id);
        }

        console.log('🎉 Checkout processing complete!');
    }

    @Post('webhook')
    async handleWebhook(@Req() req: Request, @Res() res: Response) {
        const signature = req.headers['stripe-signature'];

        if (!signature || typeof signature !== 'string') {
            return res.status(HttpStatus.BAD_REQUEST).send('Missing signature');
        }

        try {
            const event = await this.stripeService.constructWebhookEvent(
                req.body,
                signature
            );

            console.log('📨 Stripe webhook received:', event.type);

            switch (event.type) {
                case 'checkout.session.completed': {
                    const session = event.data.object as any;
                    console.log('✅ Checkout completed:', session.id);

                    // Auto-create user, order, and consent
                    await this.handleCheckoutCompleted(session);
                    break;
                }

                case 'payment_intent.succeeded': {
                    const paymentIntent = event.data.object as any;
                    console.log('💰 Payment succeeded:', paymentIntent.id);
                    break;
                }

                case 'customer.subscription.created':
                case 'customer.subscription.updated':
                case 'customer.subscription.deleted': {
                    const subscription = event.data.object as any;
                    console.log('📋 Subscription event:', subscription.id);
                    // TODO: Handle subscription updates
                    break;
                }

                default:
                    console.log('ℹ️  Unhandled event type:', event.type);
            }

            return res.json({ received: true });
        } catch (err) {
            console.error('❌ Webhook error:', err);
            return res.status(HttpStatus.BAD_REQUEST).send('Invalid signature');
        }
    }
}
