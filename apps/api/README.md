# @petra/api - Backend API

NestJS backend for Petra Online Coaching Platform with Stripe integration.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- PostgreSQL (Supabase recommended)

### Installation

```bash
# Install dependencies (from monorepo root)
pnpm install

# Set up environment variables
cp env.example .env
# Edit .env with your values
```

### Database Setup

```bash
# Generate Prisma Client
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate

# Open Prisma Studio (optional)
pnpm prisma:studio
```

### Development

```bash
# Run in watch mode
pnpm dev

# The API will be available at http://localhost:3001
```

### Build & Production

```bash
# Build
pnpm build

# Run production build
pnpm start
```

## 📁 Project Structure

```
src/
├── app.module.ts           # Main application module
├── main.ts                 # Application entry point
├── prisma/                 # Prisma service
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── checkout/               # Checkout flow
│   ├── checkout.controller.ts
│   ├── checkout.service.ts
│   └── dto/
├── stripe/                 # Stripe integration
│   ├── stripe.controller.ts
│   └── stripe.service.ts
└── plans/                  # Plan management
    └── plans.service.ts
```

## 🔧 Environment Variables

See `env.example` for all required environment variables.

### Key Variables

- `DATABASE_URL`: PostgreSQL connection string (Supabase)
- `STRIPE_SECRET_KEY`: Stripe API secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret
- `FRONTEND_URL`: Frontend URL for CORS
- `PRICE_ID_*`: Stripe Price IDs for all plan variants

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Checkout
```
POST /api/checkout/sessions
Body: {
  planId: string
  email: string
  acceptedTos: boolean
  marketingOptIn?: boolean
  disclosureVersion: string
}
```

### Stripe Webhooks
```
POST /api/stripe/webhook
```

## 🗄️ Database

Using Prisma ORM with PostgreSQL (Supabase).

### Schema

- **User**: User accounts
- **Order**: Purchase orders
- **Consent**: User consents (TOS, marketing)
- **Subscription**: Active subscriptions
- **PlanCatalog**: Available plans

### Migrations

```bash
# Create a new migration
pnpm prisma migrate dev --name migration_name

# Deploy migrations (production)
pnpm prisma:deploy
```

## 🔐 Stripe Integration

### Webhooks

Configure Stripe webhook endpoint:
```
https://your-api.com/api/stripe/webhook
```

Events handled:
- `checkout.session.completed`
- `payment_intent.succeeded`
- `customer.subscription.*`

### Testing Webhooks Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks
stripe listen --forward-to localhost:3001/api/stripe/webhook
```

## 🐳 Docker

```bash
# Build
docker build -t petra-api .

# Run
docker run -p 3001:3001 --env-file .env petra-api
```

## 📝 TODOs

Current implementation matches the existing Express backend. Future enhancements:

- [ ] Complete webhook handler (persist orders, consents, subscriptions)
- [ ] Add authentication (JWT)
- [ ] Add user management endpoints
- [ ] Add workout/nutrition management
- [ ] Add progress tracking
- [ ] Add chat/messaging
- [ ] Add file uploads (S3)
- [ ] Add email notifications

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```

