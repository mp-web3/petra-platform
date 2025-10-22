import { Injectable, BadRequestException } from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { PlansService } from '../plans/plans.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';

@Injectable()
export class CheckoutService {
    constructor(
        private readonly stripeService: StripeService,
        private readonly plansService: PlansService
    ) { }

    async createCheckoutSession(dto: CreateCheckoutSessionDto, idempotencyKey?: string) {
        const { planId, email, marketingOptIn, disclosureVersion } = dto;

        // Get Stripe price ID from plan slug
        const priceId = this.plansService.getPriceIdByPlanSlug(planId);

        if (!priceId) {
            throw new BadRequestException('Unknown planId');
        }

        console.log('CheckoutSession request →', { planId, priceId });

        // Create Stripe checkout session
        const session = await this.stripeService.createCheckoutSession(
            priceId,
            email,
            {
                planId,
                marketingOptIn: marketingOptIn ? 'true' : 'false',
                disclosureVersion,
            },
            idempotencyKey
        );

        return { url: session.url };
    }
}

