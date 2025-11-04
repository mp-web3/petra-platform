import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { EmailService } from 'src/email/email.service';
import { EmailModule } from '../email/email.module';
import { AuthModule } from '../auth/auth.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
    imports: [
        ConfigModule,
        EmailModule, // Provides EmailService
        AuthModule, // Provides AuthService for token generation
        forwardRef(() => SubscriptionModule), // Module-level circular dependency (SubscriptionModule also imports StripeModule)
    ],
    controllers: [StripeController],
    providers: [StripeService],
    exports: [StripeService],
})
export class StripeModule { }

