# 🚀 Getting Started with Petra Platform

Complete guide to set up and run the Petra Platform monorepo.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** >= 20.0.0 ([Download](https://nodejs.org/))
- **pnpm** >= 9.0.0 (Install: `npm install -g pnpm`)
- **Docker Desktop** (for local development with databases)
- **Git**

## 🏁 Quick Start (5 minutes)

### 1. Clone and Install

```bash
# Navigate to the project
cd /Users/mattiapapa/Code/petra/petra-platform

# Install all dependencies
pnpm install
```

### 2. Set Up Environment Variables

```bash
# API
cp apps/api/env.example apps/api/.env
# Edit apps/api/.env with your values

# Web Marketing
cp apps/web-marketing/env.example apps/web-marketing/.env

# Web Coaching
cp apps/web-coaching/env.example apps/web-coaching/.env
```

### 3. Start Database

```bash
# Start PostgreSQL with Docker
docker-compose up postgres -d
```

### 4. Set Up Database

```bash
# Generate Prisma Client
cd apps/api
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate

# Go back to root
cd ../..
```

### 5. Start Development Servers

```bash
# Start all apps (API + Frontends)
pnpm dev
```

Access your apps:
- **API**: http://localhost:3001
- **Marketing Site**: http://localhost:3000
- **Coaching Platform**: http://localhost:3002

## 📁 Project Structure

```
petra-platform/
├── apps/
│   ├── api/                     # NestJS Backend
│   ├── web-marketing/           # Marketing Website (Next.js)
│   └── web-coaching/            # Coaching Platform (Next.js)
├── packages/
│   ├── ui/                      # Chakra UI components
│   ├── types/                   # Shared TypeScript types
│   ├── utils/                   # Shared utilities
│   ├── api-client/              # API client library
│   └── config/                  # Shared configs
├── docs/                        # Documentation
├── package.json                 # Root package.json
├── pnpm-workspace.yaml          # pnpm workspace config
├── turbo.json                   # Turborepo config
└── docker-compose.yml           # Docker setup
```

## 🔑 Environment Setup

### API (.env)

```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Supabase PostgreSQL
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public"

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (get from Stripe Dashboard)
PRICE_ID_W_STARTER_6W=price_...
PRICE_ID_W_STARTER_18W=price_...
# ... etc
```

### Frontend Apps (.env)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🗄️ Database Setup (Supabase)

### Option 1: Local Docker (Recommended for Development)

```bash
# Already started in Quick Start
docker-compose up postgres -d
```

Connection string:
```
postgresql://petra:petra_dev_password@localhost:5432/petra_platform?schema=public
```

### Option 2: Supabase Cloud

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Get connection string from Settings → Database
4. Update `DATABASE_URL` in `apps/api/.env`

## 🛠️ Common Commands

### Development

```bash
# Start all apps
pnpm dev

# Start specific app
pnpm --filter @petra/api dev
pnpm --filter @petra/web-marketing dev
pnpm --filter @petra/web-coaching dev

# Start with Docker (all services)
docker-compose up
```

### Building

```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter @petra/api build
```

### Database

```bash
cd apps/api

# Generate Prisma Client
pnpm prisma:generate

# Create migration
pnpm prisma migrate dev --name migration_name

# Open Prisma Studio
pnpm prisma:studio

# Reset database (CAUTION!)
pnpm prisma migrate reset
```

### Testing

```bash
# Run tests
pnpm test

# Run tests for specific app
pnpm --filter @petra/api test
```

### Linting & Type Checking

```bash
# Lint all apps
pnpm lint

# Type check all apps
pnpm typecheck
```

## 📦 Package Management

### Adding Dependencies

```bash
# Add to specific app
pnpm --filter @petra/api add express

# Add to workspace root (dev dependencies)
pnpm add -D -w prettier

# Add to shared package
pnpm --filter @petra/ui add react-icons
```

### Updating Dependencies

```bash
# Update all dependencies
pnpm update

# Update specific package
pnpm update next --latest
```

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Find process
lsof -i :3001

# Kill process
kill -9 <PID>
```

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps

# Check logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Build Errors

```bash
# Clean everything
pnpm clean

# Remove node_modules
rm -rf node_modules apps/*/node_modules packages/*/node_modules

# Reinstall
pnpm install

# Rebuild
pnpm build
```

### Prisma Issues

```bash
cd apps/api

# Regenerate client
pnpm prisma:generate

# Reset and migrate
pnpm prisma migrate reset

# Format schema
pnpm prisma format
```

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

Quick links:
- **API**: Railway, Render, AWS
- **Frontend**: Vercel (recommended)
- **Database**: Supabase, Neon, Railway

## 📚 Next Steps

1. ✅ Complete [Stripe Setup](./STRIPE_SETUP.md)
2. ✅ Review [API Documentation](../apps/api/README.md)
3. ✅ Learn about [Docker Setup](./DOCKER.md)
4. ✅ Read [Deployment Guide](./DEPLOYMENT.md)

## 🆘 Getting Help

- Check existing documentation in `docs/`
- Review app-specific READMEs
- Check the issues/discussions

## 🎉 You're Ready!

You now have the complete Petra Platform running locally. Happy coding! 🚀

