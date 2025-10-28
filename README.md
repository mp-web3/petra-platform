# 🏋️‍♀️ Petra Platform - Monorepo

Complete online coaching platform with marketing website, coaching app, and backend API.

## 📦 Structure

```
petra-platform/
├── apps/
│   ├── web-marketing/     # Marketing website (Next.js)
│   ├── web-coaching/      # Coaching platform (Next.js)
│   └── api/               # Backend API (NestJS + Prisma)
└── packages/
    ├── ui/                # Shared UI components (Chakra UI)
    ├── types/             # Shared TypeScript types
    ├── utils/             # Shared utilities
    ├── api-client/        # API client for frontends
    └── config/            # Shared configurations
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- Docker Desktop (for PostgreSQL)

### Step 1: Installation

```bash
# Navigate to project
cd /path/to/petra-platform

# Install dependencies
pnpm install
```

### Step 2: Environment Setup

```bash
# Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/web-marketing/.env.example apps/web-marketing/.env
cp apps/web-coaching/.env.example apps/web-coaching/.env

# Edit apps/api/.env and add your Stripe keys and Price IDs
```

### Step 3: Database Setup

```bash
# IMPORTANT: Stop local PostgreSQL if running (to avoid port conflicts)
brew services stop postgresql@16  # or your version
# Verify: lsof -i :5432 should only show Docker

# Start Docker Desktop application first!

# Start PostgreSQL container
docker-compose up postgres -d

# Verify it's running
docker-compose ps

# Generate Prisma Client
cd apps/api
pnpm prisma:generate

# Run database migrations
pnpm prisma migrate dev --name init

# (Optional) Open Prisma Studio to view database
pnpm prisma:studio

# Return to root
cd ../..
```

### Step 4: Start Development Servers

#### Option A: Run All Services Together

```bash
# Start API + Marketing + Coaching (from root)
pnpm dev
```

#### Option B: Run Services Individually

```bash
# Terminal 1: Start API
pnpm --filter @petra/api dev

# Terminal 2: Start Marketing Website
pnpm --filter @petra/web-marketing dev

# Terminal 3: Start Coaching Platform
pnpm --filter @petra/web-coaching dev
```

### Step 5: Access Your Apps

- **Marketing Website**: http://localhost:3000
- **Coaching Platform**: http://localhost:3002
- **API Server**: http://localhost:3001
- **Prisma Studio**: http://localhost:5555 (when running)

### Verify Everything Works

```bash
# Check if API is responding
curl http://localhost:3001

# Check if PostgreSQL is accessible
docker exec petra-postgres psql -U petra -d petra_platform -c "SELECT version();"

# Check running services
docker-compose ps
lsof -i :3000,3001,3002,5432
```

### Build

```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter @petra/api build
```

## 🐳 Docker Development

```bash
# Start all services (including PostgreSQL)
docker-compose up

# Start in background
docker-compose up -d

# Stop services (keeps data!)
docker-compose down

# View logs
docker-compose logs -f postgres
docker-compose logs -f api

# Restart a specific service
docker-compose restart postgres
```

### 💾 Data Persistence

**✅ Your database data WILL persist** across Docker restarts! PostgreSQL data is stored in a Docker volume.

```bash
# Check volume status
docker volume ls | grep postgres

# View volume details
docker volume inspect petra-platform_postgres_data

# Test persistence (creates test data, restarts container, checks if data survives)
cd apps/api && ./test-persistence.sh

# ⚠️ DANGEROUS: Delete all data (nuclear option)
docker-compose down -v  # -v flag removes volumes
```

**What persists:**
- ✅ All database tables and records (users, orders, payments, consents)
- ✅ Prisma migrations history
- ✅ All your production data

**Safe operations (data is kept):**
- `docker-compose down` → ✅ Stops container, **data SAVED**
- `docker-compose restart postgres` → ✅ Restarts container, **data SAVED**
- Computer restart → ✅ **Data SAVED**
- Container deletion → ✅ Volume is separate, **data SAVED**

**Dangerous operations (data is deleted):**
- `docker-compose down -v` → ❌ **Data DELETED** (the `-v` flag removes volumes)
- `docker volume rm petra-platform_postgres_data` → ❌ **Data DELETED**

📖 **See detailed guide**: [docs/DATA_PERSISTENCE.md](./docs/DATA_PERSISTENCE.md)

## 🔧 Troubleshooting

### Port 5432 Already in Use

If you see "port 5432 is already allocated" or Prisma can't connect:

```bash
# Check what's using port 5432
lsof -i :5432

# If local PostgreSQL is running, stop it
brew services list
brew services stop postgresql@16  # or your version

# Verify only Docker is using the port
lsof -i :5432  # Should only show Docker
```

### Prisma Migration Errors

If migrations fail with "User was denied access":

```bash
# Grant necessary permissions
docker exec petra-postgres psql -U petra -d postgres -c "ALTER USER petra CREATEDB;"

# Try migration again
cd apps/api && pnpm prisma migrate dev --name init
```

### API Won't Start

```bash
# Check for TypeScript errors
cd apps/api && pnpm typecheck

# Make sure database is running
docker-compose ps

# Check if port 3001 is available
lsof -i :3001

# View API logs
pnpm --filter @petra/api dev
```

### Database Connection Issues

```bash
# Test connection from host
PGPASSWORD=petra_dev_password psql -h localhost -p 5432 -U petra -d petra_platform -c "SELECT 1;"

# Check container logs
docker logs petra-postgres

# Restart PostgreSQL container
docker-compose restart postgres
```

### Backup and Restore Database

```bash
# Backup database to file
docker exec petra-postgres pg_dump -U petra petra_platform > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
docker exec -i petra-postgres psql -U petra -d petra_platform < backup_20250127_120000.sql

# Copy backup to safe location
cp backup_*.sql ~/Backups/petra/
```

### Clean Start (Nuclear Option)

```bash
# BACKUP FIRST (if you want to keep data)
docker exec petra-postgres pg_dump -U petra petra_platform > backup_before_clean.sql

# Stop everything and delete volumes
docker-compose down -v  # -v removes volumes

# Remove node_modules
rm -rf node_modules apps/*/node_modules packages/*/node_modules

# Reinstall
pnpm install

# Start fresh
docker-compose up postgres -d
cd apps/api
pnpm prisma:generate
pnpm prisma migrate dev --name init
cd ../..
pnpm dev
```

## 🔄 Daily Development Workflow

```bash
# Morning startup
docker-compose up postgres -d  # Start database

# Terminal 1: Forward Stripe webhooks (for testing payments)
stripe listen --forward-to localhost:3001/api/stripe/webhook
# Copy the webhook secret and update apps/api/.env if changed

# Terminal 2: Start API
pnpm --filter @petra/api dev

# Terminal 3: Start frontend
pnpm --filter @petra/web-marketing dev

# When done for the day
# Ctrl+C to stop dev servers and stripe listen
docker-compose down  # Stop database (optional - can leave running)

# Common tasks
cd apps/api && pnpm prisma:studio  # View database (GUI)
cd apps/api && ./check-database.sh  # Quick database check (CLI)
cd apps/api && pnpm prisma migrate dev --name add_something  # New migration
pnpm typecheck  # Check types across all apps
pnpm lint  # Lint all apps
```

## 🗄️ Database Management

### View Data Visually

```bash
# Open Prisma Studio (recommended)
cd apps/api && pnpm prisma:studio
# Opens browser at http://localhost:5555
```

### Check Data via CLI

```bash
# Run the check script
cd apps/api && ./check-database.sh

# Or connect directly
docker exec petra-postgres psql -U petra -d petra_platform

# Example queries
psql> SELECT * FROM users ORDER BY created_at DESC LIMIT 5;
psql> SELECT * FROM orders WHERE status = 'COMPLETED';
psql> SELECT * FROM consents WHERE marketing_opt_in = true;
```

### After Checkout Test

To verify a payment was saved correctly:

```bash
cd apps/api && ./check-database.sh

# You should see:
# - New entry in 'users' table (with email and stripe_customer_id)
# - New entry in 'orders' table (with COMPLETED status)
# - New entry in 'consents' table (with tos_accepted = true)
```

## 🔔 Testing Stripe Webhooks Locally

Stripe can't send webhooks to `localhost` directly. You need to use **Stripe CLI** to forward webhooks during development.

### One-Time Setup

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login
# This opens your browser - click "Allow access"
```

### For Each Development Session

```bash
# Terminal 1: Forward webhooks to your local API
stripe listen --forward-to localhost:3001/api/stripe/webhook

# You'll see:
# > Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx

# Copy that webhook secret!

# Terminal 2: Update .env with the webhook secret
cd apps/api
nano .env
# Add or update: STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
# Save and exit (Ctrl+X, Y, Enter)

# Restart API (Ctrl+C in API terminal, then):
pnpm --filter @petra/api dev

# Terminal 3: Start frontend
pnpm --filter @petra/web-marketing dev
```

### Testing the Flow

1. **Complete a test checkout**:
   - Visit: http://localhost:3000/coaching-donna-online
   - Choose a plan → "scegli"
   - Enter email, accept terms
   - Click "Procedi al Pagamento"
   - Use test card: `4242 4242 4242 4242`
   - Complete payment

2. **Watch the API terminal** for webhook logs:
   ```
   📨 Stripe webhook received: checkout.session.completed
   ✅ Checkout completed: cs_test_xxx
   🔄 Processing checkout for: user@example.com
   ➕ Creating new user (guest checkout)
   ✅ User created: cluxxx
   📦 Order created: clvxxx
   ✅ Consent recorded
   📧 Would send activation email to: user@example.com
   🎉 Checkout processing complete!
   ```

3. **Verify in database**:
   ```bash
   cd apps/api && pnpm prisma:studio
   # Check users, orders, and consents tables
   ```

### Alternative: Test Specific Webhook Events

```bash
# Trigger a specific event without doing full checkout
stripe trigger checkout.session.completed

# Watch API terminal for the webhook processing logs
```

### Stripe CLI Reference

```bash
# View all available events
stripe trigger --help

# View webhook logs
stripe logs tail

# Test with custom data
stripe trigger checkout.session.completed --override customer_email=test@example.com
```

### Common Issues

**Issue: "Invalid signature" error**
- Make sure `STRIPE_WEBHOOK_SECRET` in `.env` matches the secret from `stripe listen`
- Restart your API after updating `.env`

**Issue: No webhook logs**
- Check that `stripe listen` is running in a separate terminal
- Verify API is running on port 3001: `curl http://localhost:3001`

**Issue: Different webhook secret each time**
- This is normal with `stripe listen` (test mode)
- For production, use the webhook secret from Stripe Dashboard

## 📚 Documentation

- [Getting Started](./docs/GETTING_STARTED.md) - Detailed setup guide
- [Data Persistence](./docs/DATA_PERSISTENCE.md) - How Docker volumes work ⭐
- [Authentication Strategy](./docs/AUTHENTICATION_STRATEGY.md) - Guest checkout → account creation ⭐
- [Docker Guide](./docs/DOCKER.md) - Docker configuration
- [Email Automation](./docs/EMAIL_AUTOMATION.md) - Email flows and providers
- [API Documentation](./apps/api/README.md) - Backend API details
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: Chakra UI v3
- **State Management**: React Query + Zustand
- **Forms**: React Hook Form + Zod

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Auth**: JWT (future)
- **Payments**: Stripe

### Infrastructure
- **Monorepo**: Turborepo
- **Package Manager**: pnpm
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel (frontend) + Railway (backend)

## 📝 License

Private - Petra Coaching Platform

