import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CheckoutModule } from './checkout/checkout.module';
import { StripeModule } from './stripe/stripe.module';
import { PlansModule } from './plans/plans.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { THROTTLE_CONFIG } from './throttle.constants';

// Conditionally import Redis storage for production
let ThrottlerStorageRedisService: any;
let Redis: any;

try {
    // Try to import Redis storage (only if installed)
    ThrottlerStorageRedisService = require('nestjs-throttler-storage-redis').ThrottlerStorageRedisService;
    Redis = require('ioredis');
} catch (error) {
    // Redis packages not installed - will use in-memory storage
    console.log('ℹ️  Redis throttler storage not available, using in-memory storage');
}

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        // ============================================================
        // Rate Limiting Configuration
        // ============================================================
        // Use Redis storage in production if available, otherwise use in-memory
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const redisHost = configService.get('REDIS_HOST');
                const redisPort = configService.get('REDIS_PORT', 6379);
                const useRedis = redisHost && ThrottlerStorageRedisService && Redis;

                const throttlers = [
                    {
                        name: 'default',
                        ...THROTTLE_CONFIG.default,
                    },
                    {
                        name: 'strict',
                        ...THROTTLE_CONFIG.strict,
                    },
                ];

                if (useRedis) {
                    // Production: Use Redis for distributed rate limiting
                    console.log(`✅ Using Redis throttler storage (${redisHost}:${redisPort})`);
                    return {
                        storage: new ThrottlerStorageRedisService(
                            new Redis({
                                host: redisHost,
                                port: redisPort,
                                retryStrategy: (times: number) => {
                                    const delay = Math.min(times * 50, 2000);
                                    return delay;
                                },
                            })
                        ),
                        throttlers,
                    };
                } else {
                    // Development: Use in-memory storage
                    console.log('ℹ️  Using in-memory throttler storage');
                    return { throttlers };
                }
            },
        }),

        PrismaModule,
        CheckoutModule,
        StripeModule,
        PlansModule,
        EmailModule,
        AuthModule,
        SubscriptionModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        // ============================================================
        // Apply rate limiting globally to all endpoints
        // ============================================================
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule { }

