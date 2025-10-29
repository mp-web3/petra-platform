import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { EmailService } from 'src/email/email.service';

@Module({
    imports: [ConfigModule],
    controllers: [StripeController],
    providers: [StripeService, EmailService],
    exports: [StripeService],
})
export class StripeModule { }

