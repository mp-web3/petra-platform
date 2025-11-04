import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
    BadRequestException,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

/**
 * SubscriptionController
 * 
 * Endpoints for users to manage their subscriptions:
 * - GET /api/subscription - Get current subscription
 * - POST /api/subscription/cancel - Cancel subscription
 * - POST /api/subscription/reactivate - Reactivate cancelled subscription
 */
@Controller('api/subscription')
@UseGuards(JwtAuthGuard) // Protect all routes with JWT authentication
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) { }

    /**
     * GET /api/subscription
     * 
     * Get user's current subscription
     * 
     * @param req - Request object (will have user after JWT auth)
     * @returns User's subscription or null
     */
    @Get()
    async getSubscription(@Request() req: any) {
        // Get userId from JWT token (set by JwtAuthGuard)
        const userId = req.user.id;

        const subscription = await this.subscriptionService.getUserSubscription(userId);
        return {
            subscription,
            hasSubscription: !!subscription,
        };
    }

    /**
     * POST /api/subscription/cancel
     * 
     * Cancel user's subscription
     * 
     * Options:
     * - cancelImmediately: true → cancels now (user loses access immediately)
     * - cancelImmediately: false → cancels at period end (user keeps access until period ends)
     * 
     * @param req - Request object
     * @param body - Cancel options
     * @returns Updated subscription
     */
    @Post('cancel')
    @HttpCode(HttpStatus.OK)
    async cancelSubscription(
        @Request() req: any,
        @Body() body: { cancelImmediately?: boolean } = {}
    ) {
        // Get userId from JWT token (set by JwtAuthGuard)
        const userId = req.user.id;

        const cancelImmediately = body.cancelImmediately || false;
        const subscription = await this.subscriptionService.cancelSubscription(
            userId,
            cancelImmediately
        );

        return {
            success: true,
            message: cancelImmediately
                ? 'Subscription cancelled immediately'
                : 'Subscription will cancel at period end',
            subscription,
        };
    }

    /**
     * POST /api/subscription/reactivate
     * 
     * Reactivate a cancelled subscription
     * 
     * Removes cancellation flag so subscription continues automatically
     * 
     * @param req - Request object
     * @returns Updated subscription
     */
    @Post('reactivate')
    @HttpCode(HttpStatus.OK)
    async reactivateSubscription(@Request() req: any) {
        // Get userId from JWT token (set by JwtAuthGuard)
        const userId = req.user.id;

        const subscription = await this.subscriptionService.reactivateSubscription(userId);

        return {
            success: true,
            message: 'Subscription reactivated',
            subscription,
        };
    }

    /**
     * GET /api/subscription/sync/:subscriptionId
     * 
     * Sync subscription status from Stripe
     * 
     * Useful for debugging or ensuring database is in sync
     * 
     * @param subscriptionId - Database subscription ID
     * @returns Updated subscription
     */
    @Get('sync/:subscriptionId')
    async syncSubscription(@Param('subscriptionId') subscriptionId: string) {
        const subscription = await this.subscriptionService.syncFromStripe(subscriptionId);
        return {
            success: true,
            subscription,
        };
    }
}
