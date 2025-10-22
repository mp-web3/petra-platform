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

                    // TODO: Implement order and consent persistence
                    // This matches the TODO from the original Express backend
                    // await this.handleCheckoutCompleted(session);
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

    // TODO: Implement these methods
    // private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    //   // Create or update user
    //   // Create order record
    //   // Store consent
    //   // Create subscription record
    // }
}

