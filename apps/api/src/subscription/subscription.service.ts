import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../stripe/stripe.service';

/**
 * SubscriptionService
 * 
 * Handles subscription management operations:
 * - Get user's subscription
 * - Cancel subscription (at period end or immediately)
 * - Reactivate cancelled subscription
 * - Update subscription (plan changes)
 * - Sync subscription status from Stripe
 */
@Injectable()
export class SubscriptionService {
    constructor(
        private prisma: PrismaService,
        private stripeService: StripeService
    ) { }

    /**
     * Get user's active subscription
     * 
     * @param userId - The user ID
     * @returns User's subscription or null if none exists
     */
    async getUserSubscription(userId: string) {
        const subscription = await this.prisma.subscription.findFirst({
            where: {
                userId,
                status: {
                    in: ['ACTIVE', 'TRIALING', 'PAST_DUE'], // Active subscriptions
                },
            },
            orderBy: {
                createdAt: 'desc', // Most recent first
            },
        });

        return subscription;
    }

    /**
     * Cancel subscription (sets cancel_at_period_end = true)
     * 
     * User will continue to have access until period end
     * 
     * @param userId - The user ID
     * @param cancelImmediately - If true, cancels immediately instead of at period end
     * @returns Updated subscription
     */
    async cancelSubscription(userId: string, cancelImmediately: boolean = false) {
        // Get user's active subscription
        const subscription = await this.getUserSubscription(userId);

        if (!subscription) {
            throw new NotFoundException('No active subscription found');
        }

        if (cancelImmediately) {
            // Cancel immediately - user loses access right away
            await this.stripeService.cancelSubscription(subscription.stripeSubscriptionId);

            // Update database
            const updated = await this.prisma.subscription.update({
                where: { id: subscription.id },
                data: {
                    status: 'CANCELLED',
                    cancelAtPeriodEnd: false,
                },
            });

            return updated;
        } else {
            // Cancel at period end - user keeps access until period ends
            await this.stripeService.updateSubscription(subscription.stripeSubscriptionId, {
                cancel_at_period_end: true,
            });

            // Update database
            const updated = await this.prisma.subscription.update({
                where: { id: subscription.id },
                data: {
                    cancelAtPeriodEnd: true,
                    // Status remains ACTIVE until period ends
                },
            });

            return updated;
        }
    }

    /**
     * Reactivate a cancelled subscription
     * 
     * Removes cancellation flag so subscription continues
     * 
     * @param userId - The user ID
     * @returns Updated subscription
     */
    async reactivateSubscription(userId: string) {
        // Get subscription (including cancelled ones)
        const subscription = await this.prisma.subscription.findFirst({
            where: {
                userId,
                status: {
                    in: ['ACTIVE', 'CANCELLED'], // Can reactivate active (with cancel flag) or cancelled
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (!subscription) {
            throw new NotFoundException('No subscription found to reactivate');
        }

        // Check if subscription exists in Stripe
        let stripeSubscription;

        try {
            stripeSubscription = await this.stripeService.retrieveSubscription(
                subscription.stripeSubscriptionId
            );
        } catch (error) {
            throw new BadRequestException('Subscription no longer exists in Stripe');
        }

        // If subscription is already cancelled in Stripe, cannot reactivate
        if (stripeSubscription.status === 'canceled') {
            throw new BadRequestException('Subscription has already been cancelled and cannot be reactivated');
        }

        // Remove cancellation flag
        await this.stripeService.updateSubscription(subscription.stripeSubscriptionId, {
            cancel_at_period_end: false,
        });

        // Update database
        const updated = await this.prisma.subscription.update({
            where: { id: subscription.id },
            data: {
                cancelAtPeriodEnd: false,
                status: 'ACTIVE', // Reactivate
            },
        });

        return updated;
    }

    /**
     * Sync subscription status from Stripe
     * 
     * Useful for ensuring database is in sync with Stripe
     * 
     * @param subscriptionId - Database subscription ID
     * @returns Updated subscription
     */
    async syncFromStripe(subscriptionId: string) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { id: subscriptionId },
        });

        if (!subscription) {
            throw new NotFoundException('Subscription not found');
        }

        const stripeSubscription = await this.stripeService.retrieveSubscription(
            subscription.stripeSubscriptionId
        );

        // Map Stripe status to our status enum
        const statusMap: Record<string, 'ACTIVE' | 'CANCELLED' | 'PAST_DUE' | 'TRIALING' | 'INCOMPLETE'> = {
            active: 'ACTIVE',
            canceled: 'CANCELLED',
            past_due: 'PAST_DUE',
            trialing: 'TRIALING',
            incomplete: 'INCOMPLETE',
            incomplete_expired: 'CANCELLED',
            unpaid: 'CANCELLED',
        };

        const status = statusMap[stripeSubscription.status] || 'CANCELLED';

        // Update database
        const updated = await this.prisma.subscription.update({
            where: { id: subscription.id },
            data: {
                status,
                cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end || false,
                currentPeriodStart: new Date((stripeSubscription as any).current_period_start * 1000),
                currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
            },
        });

        return updated;
    }

    /**
     * Update subscription webhook handler
     * 
     * Called when Stripe sends subscription.updated event
     * 
     * @param stripeSubscriptionId - Stripe subscription ID
     */
    async handleSubscriptionUpdated(stripeSubscriptionId: string) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { stripeSubscriptionId },
        });

        if (!subscription) {
            console.warn(`⚠️  Subscription not found for Stripe ID: ${stripeSubscriptionId}`);
            return;
        }

        // Sync from Stripe
        await this.syncFromStripe(subscription.id);
    }

    /**
     * Delete subscription webhook handler
     * 
     * Called when Stripe sends subscription.deleted event
     * 
     * @param stripeSubscriptionId - Stripe subscription ID
     */
    async handleSubscriptionDeleted(stripeSubscriptionId: string) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { stripeSubscriptionId },
        });

        if (!subscription) {
            console.warn(`⚠️  Subscription not found for Stripe ID: ${stripeSubscriptionId}`);
            return;
        }

        // Mark as cancelled in database
        await this.prisma.subscription.update({
            where: { id: subscription.id },
            data: {
                status: 'CANCELLED',
                cancelAtPeriodEnd: false,
            },
        });
    }
}
