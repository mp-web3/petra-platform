import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(private configService: ConfigService) {
        const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
        if (!secretKey) {
            throw new Error('STRIPE_SECRET_KEY is not defined');
        }
        this.stripe = new Stripe(secretKey, {
            apiVersion: '2025-08-27.basil',
        });
    }

    getStripeClient(): Stripe {
        return this.stripe;
    }

    async createCheckoutSession(
        priceId: string,
        email: string,
        metadata: Record<string, string>,
        idempotencyKey?: string
    ): Promise<Stripe.Checkout.Session> {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

        return this.stripe.checkout.sessions.create(
            {
                mode: 'subscription',
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                customer_email: email,
                custom_fields: [
                    {
                        key: 'full_name',
                        label: { type: 'custom', custom: 'Full name' },
                        type: 'text',
                        optional: false,
                    },
                ],
                success_url: `${frontendUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${frontendUrl}/checkout/cancel`,
                metadata,
            },
            idempotencyKey ? { idempotencyKey } : undefined
        );
    }

    async constructWebhookEvent(
        payload: Buffer,
        signature: string
    ): Promise<Stripe.Event> {
        const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
        if (!webhookSecret) {
            throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
        }
        return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    }
}

