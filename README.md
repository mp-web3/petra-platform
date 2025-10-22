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

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp apps/api/.env.example apps/api/.env
cp apps/web-marketing/.env.example apps/web-marketing/.env
cp apps/web-coaching/.env.example apps/web-coaching/.env

# Set up database
cd apps/api
pnpm prisma:generate
pnpm prisma:migrate
```

### Development

```bash
# Run all apps in development mode
pnpm dev

# Run specific app
pnpm --filter @petra/web-marketing dev
pnpm --filter @petra/web-coaching dev
pnpm --filter @petra/api dev
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
```

## 📚 Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [API Documentation](./apps/api/README.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

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

