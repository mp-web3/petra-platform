import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { StripeModule } from '../stripe/stripe.module';
import { PlansModule } from '../plans/plans.module';

@Module({
    imports: [StripeModule, PlansModule],
    controllers: [CheckoutController],
    providers: [CheckoutService],
})
export class CheckoutModule { }

