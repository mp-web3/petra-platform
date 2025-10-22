import { Controller, Post, Body, HttpException, HttpStatus, Headers } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';

@Controller('api/checkout')
export class CheckoutController {
    constructor(private readonly checkoutService: CheckoutService) { }

    @Post('sessions')
    async createSession(
        @Body() dto: CreateCheckoutSessionDto,
        @Headers('x-idempotency-key') idempotencyKey?: string
    ) {
        try {
            return await this.checkoutService.createCheckoutSession(dto, idempotencyKey);
        } catch (error) {
            console.error('Checkout error:', error);
            throw new HttpException(
                {
                    error: error instanceof Error ? error.message : 'Failed to create checkout session',
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}

