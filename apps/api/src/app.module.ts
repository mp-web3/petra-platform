import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CheckoutModule } from './checkout/checkout.module';
import { StripeModule } from './stripe/stripe.module';
import { PlansModule } from './plans/plans.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        PrismaModule,
        CheckoutModule,
        StripeModule,
        PlansModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }

