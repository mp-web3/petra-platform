# 🚦 Rate Limiting Implementation Guide

Based on [NestJS Rate Limiting Documentation](https://docs.nestjs.com/security/rate-limiting)

## 📋 Overview

This guide implements rate limiting to protect all endpoints from abuse while allowing legitimate users.

---

## 🎯 Step 1: Installation

```bash
cd apps/api
pnpm add @nestjs/throttler
```

---

## 🎯 Step 2: Configure in AppModule

**File:** `apps/api/src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
// ... other imports

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        
        // ============================================================
        // Rate Limiting Configuration
        // ============================================================
        ThrottlerModule.forRoot([
            {
                // Default limits (applied globally)
                name: 'default',
                ttl: 60000, // Time window: 60 seconds (1 minute)
                limit: 100, // Max 100 requests per minute per IP
            },
            {
                // Strict limits for sensitive endpoints
                name: 'strict',
                ttl: 3600000, // Time window: 1 hour
                limit: 10, // Max 10 requests per hour per IP
            },
        ]),
        
        // ... other modules
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
```

---

## 🎯 Step 3: Configure Per-Endpoint Limits

### Option A: Use Decorators (Recommended)

**File:** `apps/api/src/auth/auth.controller.ts`

```typescript
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler'; // Add this import
import { AuthService } from './auth.service';
// ... other imports

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('activate')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
    async activateAccount(@Body() dto: ActivateAccountDto) {
        // ... existing code
    }

    @Post('resend-activation')
    @HttpCode(HttpStatus.OK)
    @Throttle({ 
        default: { limit: 3, ttl: 3600000 } // 3 requests per hour
    })
    async resendActivation(@Body() dto: ResendActivationDto) {
        // ... existing code
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @Throttle({ 
        default: { limit: 5, ttl: 60000 } // 5 requests per minute
    })
    async login(@Body() dto: LoginDto) {
        // ... existing code
    }
}
```

### Option B: Custom Throttler Guard (More Control)

Create a custom guard for email-based rate limiting:

**File:** `apps/api/src/auth/email-throttler.guard.ts`

```typescript
import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerOptions } from '@nestjs/throttler';
import { Request } from 'express';

@Injectable()
export class EmailThrottlerGuard extends ThrottlerGuard {
    protected getTracker(req: Request): string {
        // Rate limit by email instead of IP for resend activation
        const email = req.body?.email;
        return email || req.ip; // Fallback to IP if no email
    }

    protected async generateKey(context: ExecutionContext, tracker: string, throttler: string): Promise<string> {
        return `${throttler}:${tracker}`;
    }
}
```

Then use it:

```typescript
@Post('resend-activation')
@UseGuards(EmailThrottlerGuard)
@Throttle({ default: { limit: 3, ttl: 3600000 } })
async resendActivation(@Body() dto: ResendActivationDto) {
    // ...
}
```

---

## 🎯 Step 4: Protect Other Endpoints

### Checkout Controller

**File:** `apps/api/src/checkout/checkout.controller.ts`

```typescript
import { Controller, Post, Body, Headers } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

@Controller('api/checkout')
export class CheckoutController {
    @Post('sessions')
    @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 per minute
    async createSession(
        @Body() dto: CreateCheckoutSessionDto,
        @Headers('x-idempotency-key') idempotencyKey?: string
    ) {
        // ... existing code
    }
}
```

### Subscription Controller (Protected Routes)

Protected routes (with JWT) can have higher limits since users are authenticated:

**File:** `apps/api/src/subscription/subscription.controller.ts`

```typescript
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/subscription')
@UseGuards(JwtAuthGuard) // JWT protection
export class SubscriptionController {
    @Get()
    @Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 per minute (authenticated)
    async getSubscription(@Request() req: any) {
        // ... existing code
    }

    @Post('cancel')
    @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 per minute
    async cancelSubscription(@Request() req: any) {
        // ... existing code
    }
}
```

### Email Controller (Test Endpoint)

**File:** `apps/api/src/email/email.controller.ts`

```typescript
import { Controller, Post, Get } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

@Controller('api/email')
export class EmailController {
    @Post('test')
    @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 per minute (test endpoint)
    async sendTestEmail(@Body() body: { name: string }) {
        // ... existing code
    }

    @Get('status')
    @Throttle({ default: { limit: 60, ttl: 60000 } }) // 60 per minute (health check)
    async getEmailStatus() {
        // ... existing code
    }
}
```

---

## 🎯 Step 5: Exclude Specific Endpoints

### Stripe Webhook (Should NOT be rate limited)

Stripe webhooks come from Stripe's IPs and should not be rate limited:

**File:** `apps/api/src/stripe/stripe.controller.ts`

```typescript
import { Controller, Post } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('api/stripe')
export class StripeController {
    @Post('webhook')
    @SkipThrottle() // Skip rate limiting for Stripe webhooks
    async handleWebhook(@Req() req: Request, @Res() res: Response) {
        // ... existing code
    }
}
```

---

## 📊 Recommended Rate Limits

| Endpoint | Limit | Window | Reason |
|----------|-------|--------|--------|
| **Global Default** | 100 | 1 min | General protection |
| `/api/auth/login` | 5 | 1 min | Prevent brute force |
| `/api/auth/activate` | 5 | 1 min | Prevent abuse |
| `/api/auth/resend-activation` | 3 | 1 hour | Prevent email spam |
| `/api/checkout/sessions` | 10 | 1 min | Prevent checkout abuse |
| `/api/subscription/*` | 30 | 1 min | Authenticated users |
| `/api/email/test` | 3 | 1 min | Test endpoint |
| `/api/stripe/webhook` | ❌ Skip | - | Stripe IPs |

---

## 🎯 Step 6: Custom Error Messages

Create a custom exception filter for better error messages:

**File:** `apps/api/src/common/filters/throttle-exception.filter.ts`

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Response } from 'express';

@Catch(ThrottlerException)
export class ThrottleExceptionFilter implements ExceptionFilter {
    catch(exception: ThrottlerException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = HttpStatus.TOO_MANY_REQUESTS;

        response.status(status).json({
            statusCode: status,
            message: 'Too many requests. Please try again later.',
            error: 'Too Many Requests',
            retryAfter: 60, // seconds
        });
    }
}
```

Apply globally in `main.ts`:

```typescript
import { ThrottleExceptionFilter } from './common/filters/throttle-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    
    // Apply custom throttle exception filter
    app.useGlobalFilters(new ThrottleExceptionFilter());
    
    // ... rest of bootstrap
}
```

---

## 🎯 Step 7: Redis Storage (Production)

For production with multiple servers, use Redis:

```bash
pnpm add @nestjs/throttler-storage-redis redis
```

**File:** `apps/api/src/app.module.ts`

```typescript
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import Redis from 'ioredis';

@Module({
    imports: [
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                storage: new ThrottlerStorageRedisService(
                    new Redis({
                        host: configService.get('REDIS_HOST', 'localhost'),
                        port: configService.get('REDIS_PORT', 6379),
                    })
                ),
                throttlers: [
                    {
                        name: 'default',
                        ttl: 60000,
                        limit: 100,
                    },
                ],
            }),
        }),
        // ... rest
    ],
})
```

---

## 🎯 Step 8: Environment Variables

**File:** `.env`

```env
# Rate Limiting (Optional - uses defaults if not set)
THROTTLE_TTL=60000
THROTTLE_LIMIT=100

# Redis (for production)
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## 🔒 Protection Strategy Summary

### 1. Global Protection
- ✅ All endpoints protected by default
- ✅ 100 requests/minute per IP (default)

### 2. Per-Endpoint Protection
- ✅ Sensitive endpoints have stricter limits
- ✅ Authentication endpoints: 5/min
- ✅ Resend activation: 3/hour (strictest)

### 3. Excluded Endpoints
- ✅ Stripe webhook excluded (trusted source)

### 4. Error Handling
- ✅ Custom error messages
- ✅ 429 Too Many Requests status
- ✅ Retry-After header

---

## 📝 Implementation Checklist

- [ ] Install `@nestjs/throttler`
- [ ] Configure `ThrottlerModule` in `app.module.ts`
- [ ] Add `APP_GUARD` provider for global protection
- [ ] Add `@Throttle()` decorators to sensitive endpoints
- [ ] Add `@SkipThrottle()` to Stripe webhook
- [ ] Test rate limiting locally
- [ ] Configure Redis for production (optional)
- [ ] Add custom error messages (optional)

---

## 🧪 Testing

Test rate limiting:

```bash
# Test resend activation (should fail after 3 requests/hour)
for i in {1..5}; do
  curl -X POST http://localhost:3001/api/auth/resend-activation \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com"}'
  echo ""
done

# Should get 429 Too Many Requests after 3rd request
```

---

## 📚 References

- [NestJS Rate Limiting Documentation](https://docs.nestjs.com/security/rate-limiting)
- [NestJS Throttler GitHub](https://github.com/nestjs/throttler)

