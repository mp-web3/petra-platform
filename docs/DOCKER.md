# 🐳 Docker Guide

This guide explains how to use Docker for development and production deployment of the Petra Platform.

## 📋 Prerequisites

- Docker Desktop or Docker Engine (20.10+)
- Docker Compose (v2.0+)

## 🚀 Development with Docker

### Start All Services

```bash
# Start all services (API, databases, frontends)
docker-compose up

# Start in detached mode (background)
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f api
```

### Services

The `docker-compose.yml` starts these services:

| Service         | Port | Description              |
| --------------- | ---- | ------------------------ |
| `postgres`      | 5432 | PostgreSQL database      |
| `redis`         | 6379 | Redis cache (future use) |
| `api`           | 3001 | NestJS backend API       |
| `web-marketing` | 3000 | Marketing website        |
| `web-coaching`  | 3002 | Coaching platform        |

### Access Services

- **API**: http://localhost:3001
- **Marketing Site**: http://localhost:3000
- **Coaching Platform**: http://localhost:3002
- **Health Check**: http://localhost:3001/health

### Database

Connection string for local development:
```
postgresql://petra:petra_dev_password@localhost:5432/petra_platform?schema=public
```

### Stop Services

```bash
# Stop services
docker-compose down

# Stop and remove volumes (deletes database data!)
docker-compose down -v

# Stop specific service
docker-compose stop api
```

## 🏗️ Building for Production

### Build API

```bash
# Build production image
docker build -t petra-api:latest -f apps/api/Dockerfile --target production .

# Run production container
docker run -p 3001:3001 \
  -e DATABASE_URL="your-production-db-url" \
  -e STRIPE_SECRET_KEY="your-stripe-key" \
  petra-api:latest
```

### Build Frontend (Next.js)

```bash
# Build web-marketing
docker build -t petra-web-marketing:latest -f apps/web-marketing/Dockerfile --target production .

# Build web-coaching
docker build -t petra-web-coaching:latest -f apps/web-coaching/Dockerfile --target production .
```

## 🚢 Deployment

### Railway

Railway auto-detects Dockerfiles. Add these environment variables:

**API Service:**
```env
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=https://your-frontend.com
```

**Frontend Services:**
```env
NEXT_PUBLIC_API_URL=https://your-api.railway.app
```

### Docker Compose Production

For self-hosting with docker-compose:

```bash
# Use production compose file
docker-compose -f docker-compose.prod.yml up -d
```

Create `docker-compose.prod.yml`:
```yaml
version: '3.8'
services:
  api:
    image: petra-api:latest
    restart: always
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
    ports:
      - "3001:3001"
```

## 🔧 Troubleshooting

### Rebuild Containers

```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build api

# Rebuild without cache
docker-compose build --no-cache
```

### Reset Database

```bash
# Stop services and remove volumes
docker-compose down -v

# Start fresh
docker-compose up -d postgres

# Run migrations
docker-compose exec api pnpm prisma:migrate
```

### View Container Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs api

# Follow logs
docker-compose logs -f api

# Last 100 lines
docker-compose logs --tail=100 api
```

### Execute Commands in Container

```bash
# Access API container shell
docker-compose exec api sh

# Run Prisma commands
docker-compose exec api pnpm prisma:studio
docker-compose exec api pnpm prisma:migrate

# Access PostgreSQL
docker-compose exec postgres psql -U petra -d petra_platform
```

### Clean Up

```bash
# Remove stopped containers
docker-compose rm

# Remove all unused containers, networks, images
docker system prune

# Remove all including volumes (DANGEROUS!)
docker system prune --volumes
```

## 📊 Health Checks

All services include health checks:

```bash
# Check if services are healthy
docker-compose ps

# API health check
curl http://localhost:3001/health

# PostgreSQL health check
docker-compose exec postgres pg_isready -U petra

# Redis health check
docker-compose exec redis redis-cli ping
```

## 🔒 Security Best Practices

1. **Never commit `.env` files**
2. **Use secrets management** in production (Railway, AWS Secrets Manager, etc.)
3. **Run containers as non-root** user in production
4. **Use specific image versions** (not `latest`) in production
5. **Scan images for vulnerabilities**: `docker scan petra-api:latest`

## 📝 Environment Variables

### Development
- Defaults in `docker-compose.yml`
- Can be overridden with `.env` file

### Production
- Set via hosting platform (Railway, AWS, etc.)
- Or use `docker-compose.prod.yml` with `--env-file`

## 🆘 Common Issues

### Port Already in Use

```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
```

### Out of Disk Space

```bash
# Check Docker disk usage
docker system df

# Clean up
docker system prune -a
```

### Can't Connect to Database

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Verify connection string
docker-compose exec api env | grep DATABASE_URL
```

