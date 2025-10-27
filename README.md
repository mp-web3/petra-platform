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

# Stop services
docker-compose down

# View logs
docker-compose logs -f postgres
docker-compose logs -f api

# Restart a specific service
docker-compose restart postgres
```

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

### Clean Start (Nuclear Option)

```bash
# Stop everything
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
pnpm --filter @petra/api dev   # Start API
pnpm --filter @petra/web-marketing dev  # Start frontend

# When done for the day
# Ctrl+C to stop dev servers
docker-compose down  # Stop database (optional - can leave running)

# Common tasks
cd apps/api && pnpm prisma:studio  # View database
cd apps/api && pnpm prisma migrate dev --name add_something  # New migration
pnpm typecheck  # Check types across all apps
pnpm lint  # Lint all apps
```

## 📚 Documentation

- [Getting Started](./docs/GETTING_STARTED.md) - Detailed setup guide
- [Docker Guide](./docs/DOCKER.md) - Docker configuration
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

