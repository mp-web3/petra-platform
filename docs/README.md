# 🏋️ Petra Platform - Complete Documentation

Complete guide to the Petra Online Coaching Platform, including authentication, subscriptions, email automation, rate limiting, and deployment.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Authentication System](#authentication-system)
4. [Subscription Management](#subscription-management)
5. [Email System](#email-system)
6. [Rate Limiting](#rate-limiting)
7. [Stripe Integration](#stripe-integration)
8. [Database Schema](#database-schema)
9. [Deployment](#deployment)
10. [Testing](#testing)
11. [Environment Variables](#environment-variables)

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- PostgreSQL (Supabase recommended)
- Stripe account
- Resend account (for emails)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cd apps/api
cp env.example .env
# Edit .env with your values

# Generate Prisma Client
cd apps/api
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Build API client package
cd packages/api-client
pnpm build

# Start development servers
cd apps/api
pnpm dev  # API on http://localhost:3001

cd apps/web-coaching
pnpm dev  # Frontend on http://localhost:3002
```

### Testing the Flow

1. **Start Stripe CLI** (for webhook testing):
   ```bash
   stripe listen --forward-to localhost:3001/api/stripe/webhook
   ```

2. **Complete a checkout** via the marketing site

3. **Activate account** via the activation email link

4. **Login** and access the dashboard

---

## 🏗️ Architecture Overview

### Tech Stack

- **Backend**: NestJS (TypeScript)
- **Frontend**: Next.js (React)
- **Database**: PostgreSQL (via Prisma ORM)
- **Payment**: Stripe
- **Email**: Resend
- **Rate Limiting**: NestJS Throttler (with Redis support)
- **Authentication**: JWT (Passport)

### Project Structure

```
petra-platform/
├── apps/
│   ├── api/              # NestJS backend
│   ├── web-coaching/     # Next.js coaching platform
│   └── web-marketing/    # Next.js marketing site
├── packages/
│   ├── api-client/       # Shared API client
│   ├── types/            # Shared TypeScript types
│   └── utils/            # Shared utilities
└── docs/                 # Documentation
```

### Request Flow

```
User → Frontend → API → Database
                ↓
            Stripe (payments)
            Resend (emails)
            Redis (rate limiting)
```

---

## 🔐 Authentication System

### User Journey

1. **Guest Checkout**: User completes Stripe checkout without account
2. **Auto Account Creation**: User account created automatically (no password)
3. **Activation Email**: Secure activation token sent via email
4. **Account Activation**: User sets password using activation token
5. **Login**: User logs in with email/password, receives JWT token
6. **Protected Routes**: JWT token required for subscription management

### API Endpoints

#### `POST /api/auth/activate`
Activates a user account by setting password.

**Rate Limit**: 5 requests/minute

**Request**:
```json
{
  "token": "activation-token-from-email",
  "userId": "user-id-from-email",
  "password": "SecurePass123",
  "name": "John Doe" // optional
}
```

**Response**:
```json
{
  "success": true,
  "message": "Account activated successfully",
  "user": {
    "id": "...",
    "email": "...",
    "name": "..."
  }
}
```

#### `POST /api/auth/resend-activation`
Resends activation email if user didn't receive it.

**Rate Limit**: 3 requests/hour

**Request**:
```json
{
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Activation email sent"
}
```

#### `POST /api/auth/login`
Authenticates user and returns JWT token.

**Rate Limit**: 5 requests/minute

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "...",
    "email": "...",
    "name": "..."
  }
}
```

### Security Features

- **Secure Token Generation**: 256-bit random tokens (Base64URL encoded)
- **Token Expiration**: 24 hours (configurable)
- **Password Hashing**: bcrypt with 10 salt rounds
- **Password Validation**: Minimum 8 characters, uppercase, lowercase, number
- **Token Reuse Prevention**: Tokens marked as used after activation
- **JWT Authentication**: All subscription endpoints protected

### Frontend Implementation

- **AuthContext**: React context for authentication state
- **ProtectedRoute**: Component wrapper for protected pages
- **Login Page**: `/login` with email/password form
- **Token Storage**: JWT stored in localStorage/sessionStorage

---

## 💳 Subscription Management

### Complete Flow

```
1. User completes checkout (Stripe)
   ↓
2. checkout.session.completed webhook
   → Creates User (no password)
   → Creates Order
   → Sends activation email
   ↓
3. customer.subscription.created webhook
   → Creates Subscription record
   → Links to User and Order
   ↓
4. User activates account (sets password)
   ↓
5. User can manage subscription via API
```

### API Endpoints

All subscription endpoints require JWT authentication.

**Rate Limit**: 30 requests/minute

#### `GET /api/subscription`
Get current subscription for authenticated user.

**Response**:
```json
{
  "subscription": {
    "id": "...",
    "planType": "WOMAN_STARTER",
    "duration": "WEEKS_6",
    "status": "ACTIVE",
    "currentPeriodStart": "2025-01-30T00:00:00Z",
    "currentPeriodEnd": "2025-02-13T00:00:00Z",
    "cancelAtPeriodEnd": false
  },
  "hasSubscription": true
}
```

#### `POST /api/subscription/cancel`
Cancel subscription (at period end or immediately).

**Request**:
```json
{
  "cancelImmediately": false  // true = cancel now, false = cancel at period end
}
```

**Response**:
```json
{
  "success": true,
  "message": "Subscription will cancel at period end",
  "subscription": { ... }
}
```

#### `POST /api/subscription/reactivate`
Reactivate a cancelled subscription.

**Response**:
```json
{
  "success": true,
  "message": "Subscription reactivated",
  "subscription": { ... }
}
```

#### `GET /api/subscription/sync/:subscriptionId`
Sync subscription status from Stripe (admin/debug endpoint).

### Subscription Status Flow

- **ACTIVE**: Subscription is active and user has access
- **CANCELLED**: Subscription cancelled, user loses access
- **PAST_DUE**: Payment failed, access may be limited
- **cancelAtPeriodEnd**: Flag indicating subscription will cancel at period end

### Webhook Events

- `checkout.session.completed`: Creates user, order, sends activation email
- `customer.subscription.created`: Creates subscription record
- `customer.subscription.updated`: Syncs subscription status
- `customer.subscription.deleted`: Marks subscription as cancelled

---

## 📧 Email System

### Email Service (Resend)

All transactional emails are sent via Resend and logged in the database.

### Email Types

- **Order Confirmation**: Sent after successful checkout
- **Account Activation**: Sent to new users with activation link
- **Test Email**: For testing email configuration

### Email Logging

All emails are logged in the `email_logs` table with:
- Status (SENT, FAILED, DELIVERED, OPENED, BOUNCED)
- Provider ID (Resend email ID)
- Error messages (if failed)
- Timestamps (sent, delivered, opened)

### API Endpoints

#### `POST /api/email/test`
Send test email.

**Rate Limit**: 3 requests/minute

**Request**:
```json
{
  "name": "Test User"
}
```

#### `GET /api/email/status`
Check email service status.

**Rate Limit**: 60 requests/minute

### Domain Configuration

For production, configure your domain in Resend:

1. Add domain to Resend dashboard
2. Add DNS records (TXT, MX, SPF, DKIM)
3. Verify domain in Resend
4. Use verified domain in emails: `Petra <noreply@coachingpetra.com>`

---

## 🚦 Rate Limiting

### Overview

All endpoints are protected by rate limiting to prevent abuse. The system uses NestJS Throttler with support for Redis in production.

### Rate Limits

| Endpoint                      | Limit         | Window | Reason                       |
| ----------------------------- | ------------- | ------ | ---------------------------- |
| **Global Default**            | 100 requests  | 1 min  | General protection           |
| `/api/auth/login`             | 5 requests    | 1 min  | Prevent brute force          |
| `/api/auth/activate`          | 5 requests    | 1 min  | Prevent abuse                |
| `/api/auth/resend-activation` | 3 requests    | 1 hour | Prevent email spam           |
| `/api/checkout/sessions`      | 10 requests   | 1 min  | Prevent checkout abuse        |
| `/api/subscription/*`         | 30 requests   | 1 min  | Authenticated endpoints       |
| `/api/email/test`             | 3 requests    | 1 min  | Test endpoint                |
| `/api/email/status`           | 60 requests   | 1 min  | Health check                 |
| `/api/stripe/webhook`         | ❌ Skip       | -      | Stripe webhooks (trusted)    |

### Configuration

Rate limits are defined in `apps/api/src/throttle.constants.ts` and applied via decorators:

```typescript
@Throttle({ default: THROTTLE_CONFIG.auth.login })
@Post('login')
async login() { ... }
```

### Redis Support

For production with multiple servers, Redis is automatically used when `REDIS_HOST` is set:

```env
REDIS_HOST=your-redis-host
REDIS_PORT=6379
```

**Benefits**:
- Shared rate limiting across all servers
- Consistent limits in load-balanced environments
- Distributed tracking

**Development**: Uses in-memory storage (no Redis required)

### Error Response

When rate limit exceeded:

```json
{
  "statusCode": 429,
  "message": "Too many requests. Please try again later.",
  "error": "Too Many Requests",
  "retryAfter": 60
}
```

### Testing Rate Limits

Use the provided test script:

```bash
cd apps/api
./scripts/test-rate-limiting.sh login
./scripts/test-rate-limiting.sh resend-activation
./scripts/test-rate-limiting.sh all
```

---

## 💰 Stripe Integration

### Webhook Endpoint

`POST /api/stripe/webhook` - Handles all Stripe webhook events.

**Security**: Stripe signature verification required. Raw body parsing used for signature validation.

### Supported Events

1. **checkout.session.completed**
   - Creates/updates user
   - Creates order
   - Records consent (GDPR)
   - Sends order confirmation email
   - Generates activation token
   - Sends activation email (new users only)

2. **customer.subscription.created**
   - Creates subscription record
   - Links to user and order
   - Sets subscription status to ACTIVE

3. **customer.subscription.updated**
   - Syncs subscription status from Stripe
   - Updates cancellation flags
   - Updates period dates

4. **customer.subscription.deleted**
   - Marks subscription as cancelled
   - User loses access

### Checkout Flow

1. Frontend calls `POST /api/checkout/sessions` with plan details
2. API creates Stripe checkout session
3. User completes payment on Stripe
4. Stripe sends webhook to API
5. API processes webhook and creates user/order/subscription

### Plan Mapping

Plans are mapped from Stripe metadata to database enums:

- `woman-starter-6w` → `WOMAN_STARTER` + `WEEKS_6`
- `woman-premium-18w` → `WOMAN_PREMIUM` + `WEEKS_18`
- `man-starter-36w` → `MAN_STARTER` + `WEEKS_36`
- etc.

---

## 🗄️ Database Schema

### Key Models

#### User
- `id`: Unique identifier
- `email`: Unique email address
- `password`: Hashed password (nullable, set during activation)
- `name`: User's name (optional)
- `stripeCustomerId`: Stripe customer ID
- `emailVerified`: Boolean flag
- `activatedAt`: Timestamp when account was activated

#### Order
- `id`: Unique identifier
- `userId`: Foreign key to User
- `planId`: Plan identifier from Stripe
- `amount`: Order amount (in cents)
- `currency`: Currency code
- `status`: OrderStatus enum (PENDING, COMPLETED, FAILED, REFUNDED)
- `stripeSessionId`: Stripe checkout session ID
- `signUpStatus`: SignUpStatus enum (PENDING, ACTIVATED, EXPIRED)

#### Subscription
- `id`: Unique identifier
- `userId`: Foreign key to User
- `planType`: SubscriptionPlanType enum
- `duration`: PlanDuration enum (WEEKS_6, WEEKS_18, WEEKS_36)
- `status`: SubscriptionStatus enum (ACTIVE, CANCELLED, PAST_DUE, etc.)
- `stripeSubscriptionId`: Stripe subscription ID
- `currentPeriodStart`: Subscription period start date
- `currentPeriodEnd`: Subscription period end date
- `cancelAtPeriodEnd`: Boolean flag for cancellation

#### ActivationToken
- `id`: Unique identifier
- `token`: Secure random token (256 bits, Base64URL)
- `userId`: Foreign key to User
- `expiresAt`: Token expiration date (24 hours)
- `usedAt`: Timestamp when token was used (nullable)

#### EmailLog
- `id`: Unique identifier
- `emailType`: EmailType enum
- `recipientEmail`: Email address
- `status`: EmailStatus enum (SENT, FAILED, DELIVERED, OPENED, BOUNCED)
- `providerId`: Resend email ID
- `errorMessage`: Error message if failed
- Timestamps: `sentAt`, `deliveredAt`, `openedAt`

#### Consent
- `id`: Unique identifier
- `orderId`: Foreign key to Order
- `tosAccepted`: Terms of service accepted
- `privacyAccepted`: Privacy policy accepted
- `marketingOptIn`: Marketing consent (optional)
- `disclosureTosVersion`: Version of ToS user accepted
- `disclosurePrivacyVersion`: Version of Privacy Policy user accepted
- `ipAddress`: User's IP address (for audit)
- `userAgent`: User's browser/device info

### Migrations

Run migrations with:

```bash
cd apps/api
npx prisma migrate dev
npx prisma generate
```

---

## 🚢 Deployment

### Recommended Stack

| Component   | Service    | Why                               |
| ----------- | ---------- | --------------------------------- |
| Frontend    | Vercel     | Zero config, great Next.js support |
| Backend     | Railway    | Easy Node.js deployment           |
| Database    | Supabase   | Managed Postgres, generous free tier |
| Cache       | Upstash    | Serverless Redis                  |
| Email       | Resend     | Modern email API                  |

### Environment Variables

#### API (apps/api/.env)

```env
# Application
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
RESEND_API_KEY=re_...

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.com

# Redis (optional - for production rate limiting)
REDIS_HOST=your-redis-host
REDIS_PORT=6379

# Stripe Price IDs
PRICE_ID_W_STARTER_6W=price_...
# ... (all other price IDs)
```

#### Frontend (apps/web-coaching/.env.local)

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Deployment Steps

1. **Database**: Set up Supabase PostgreSQL
2. **Run Migrations**: `npx prisma migrate deploy`
3. **Backend**: Deploy to Railway/Render
4. **Frontend**: Deploy to Vercel
5. **Stripe Webhook**: Configure webhook URL in Stripe Dashboard
6. **Redis**: Set up Upstash Redis (optional but recommended)
7. **Domain**: Configure DNS for email domain in Resend

### Stripe Webhook Configuration

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-api-domain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### Docker

The project includes Dockerfiles for containerized deployment:

```bash
# Build API
docker build -t petra-api -f apps/api/Dockerfile .

# Run API
docker run -p 3001:3001 \
  -e DATABASE_URL="..." \
  -e STRIPE_SECRET_KEY="..." \
  petra-api
```

---

## 🧪 Testing

### Manual Testing

#### Test Activation Flow

1. Complete a checkout (use Stripe test card: `4242 4242 4242 4242`)
2. Check API logs for user/order creation
3. Get activation token from database:
   ```sql
   SELECT token, userId FROM activation_tokens ORDER BY createdAt DESC LIMIT 1;
   ```
4. Activate account:
   ```bash
   curl -X POST http://localhost:3001/api/auth/activate \
     -H "Content-Type: application/json" \
     -d '{
       "token": "YOUR_TOKEN",
       "userId": "YOUR_USER_ID",
       "password": "SecurePass123",
       "name": "Test User"
     }'
   ```
5. Login:
   ```bash
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "user@example.com",
       "password": "SecurePass123"
     }'
   ```

#### Test Rate Limiting

```bash
cd apps/api
./scripts/test-rate-limiting.sh login
./scripts/test-rate-limiting.sh resend-activation
./scripts/test-rate-limiting.sh all
```

### Test Checklist

- [ ] Database migration runs successfully
- [ ] Prisma client generates without errors
- [ ] API starts on port 3001
- [ ] Can complete Stripe checkout
- [ ] User created in database (no password)
- [ ] Order created in database
- [ ] Activation email sent (or token created)
- [ ] Can activate account with token
- [ ] Password is hashed in database
- [ ] Can login with email/password
- [ ] JWT token received
- [ ] Can access protected subscription endpoints
- [ ] Rate limiting works correctly
- [ ] Webhook processing works

---

## 🔧 Environment Variables

### Required Variables

#### API

- `DATABASE_URL`: PostgreSQL connection string
- `STRIPE_SECRET_KEY`: Stripe API secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret
- `RESEND_API_KEY`: Resend API key for emails
- `JWT_SECRET`: Secret key for JWT token signing
- `FRONTEND_URL`: Frontend URL for CORS

#### Optional Variables

- `REDIS_HOST`: Redis host (for production rate limiting)
- `REDIS_PORT`: Redis port (default: 6379)
- `PORT`: API port (default: 3001)
- `NODE_ENV`: Environment (development/production)

#### Stripe Price IDs

All plan variants need price IDs:
- `PRICE_ID_W_STARTER_6W`
- `PRICE_ID_W_STARTER_18W`
- `PRICE_ID_W_STARTER_36W`
- `PRICE_ID_W_PREMIUM_6W`
- `PRICE_ID_W_PREMIUM_18W`
- `PRICE_ID_W_PREMIUM_36W`
- `PRICE_ID_M_STARTER_6W`
- `PRICE_ID_M_STARTER_18W`
- `PRICE_ID_M_STARTER_36W`
- `PRICE_ID_M_PREMIUM_6W`
- `PRICE_ID_M_PREMIUM_18W`
- `PRICE_ID_M_PREMIUM_36W`

---

## 📚 Additional Resources

- **API Client**: `packages/api-client` - Shared API client for frontend
- **Types**: `packages/types` - Shared TypeScript types
- **Utils**: `packages/utils` - Shared utilities
- **Test Scripts**: `apps/api/scripts/test-rate-limiting.sh`

---

## 🐛 Troubleshooting

### Common Issues

**"Property 'password' does not exist"**
- Run: `npx prisma migrate dev` and `npx prisma generate`

**"JWT_SECRET is not defined"**
- Add `JWT_SECRET` to `apps/api/.env`

**"401 Unauthorized" on login**
- Check: Account is activated, password is correct, JWT_SECRET matches

**"429 Too Many Requests"**
- Check: Rate limit exceeded, wait for time window to reset

**Email not sending**
- Check: `RESEND_API_KEY` is set correctly
- Verify: Domain is configured in Resend
- Check: Email logs in database for error messages

**Webhook not working**
- Check: Stripe signature verification
- Verify: `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- Ensure: Raw body parsing is enabled for webhook endpoint

---

## ✅ Production Readiness Checklist

- [ ] All environment variables set
- [ ] Database migrations deployed
- [ ] Stripe webhook configured
- [ ] Email domain verified in Resend
- [ ] Redis configured (for production rate limiting)
- [ ] CORS configured correctly
- [ ] JWT_SECRET is strong and secure
- [ ] All price IDs configured
- [ ] Error logging configured
- [ ] Monitoring set up

---

**Last Updated**: January 2025
**Version**: 1.0.0

