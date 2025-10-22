# 🚢 Deployment Guide

Complete guide for deploying Petra Platform to production.

## 🏗️ Architecture Overview

```
┌─────────────────┐
│   web-marketing │──► Vercel (Static/SSR)
│   web-coaching  │──► Vercel (SSR)
└─────────────────┘
         │
         ├──► API (Railway/Render)
         │         │
         │         ├──► PostgreSQL (Supabase)
         │         ├──► Redis (Upstash)
         │         └──► S3 (Cloudflare R2)
         │
         └──► Stripe Webhooks
```

## 🎯 Recommended Stack

| Component    | Service       | Why                                  |
| ------------ | ------------- | ------------------------------------ |
| **Frontend** | Vercel        | Zero config, great Next.js support   |
| **Backend**  | Railway       | Easy Node.js deployment, great DX    |
| **Database** | Supabase      | Managed Postgres, generous free tier |
| **Cache**    | Upstash       | Serverless Redis                     |
| **Storage**  | Cloudflare R2 | S3-compatible, affordable            |

## 🚀 Frontend Deployment (Vercel)

### web-marketing

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login
   vercel login
   
   # Deploy
   cd apps/web-marketing
   vercel
   ```

2. **Configure Project**
   - **Framework**: Next.js
   - **Root Directory**: `apps/web-marketing`
   - **Build Command**: `cd ../.. && pnpm build --filter @petra/web-marketing`
   - **Output Directory**: `.next`

3. **Environment Variables**
   ```env
   NEXT_PUBLIC_API_URL=https://your-api.railway.app
   NEXT_PUBLIC_APP_URL=https://petra-marketing.vercel.app
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

### web-coaching

Same as web-marketing, but:
- **Root Directory**: `apps/web-coaching`
- **Build Command**: `cd ../.. && pnpm build --filter @petra/web-coaching`

## 🔧 Backend Deployment (Railway)

### Method 1: Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy API
cd apps/api
railway up
```

### Method 2: Railway Dashboard

1. Go to [railway.app](https://railway.app)
2. Create new project → Deploy from GitHub
3. Select `petra-platform` repo
4. Configure:
   - **Root Directory**: `apps/api`
   - **Build Command**: `pnpm install && pnpm --filter @petra/api build`
   - **Start Command**: `pnpm --filter @petra/api start`

### Environment Variables (Railway)

```env
NODE_ENV=production
PORT=${{PORT}}
DATABASE_URL=${{POSTGRES.DATABASE_URL}}
FRONTEND_URL=https://petra-marketing.vercel.app

STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# All Stripe Price IDs
PRICE_ID_W_STARTER_6W=price_...
PRICE_ID_W_STARTER_18W=price_...
# ... etc
```

### Add PostgreSQL (Railway)

1. In Railway dashboard → Add PostgreSQL plugin
2. It auto-creates `DATABASE_URL` variable
3. Run migrations:
   ```bash
   railway run pnpm prisma:migrate deploy
   ```

## 🗄️ Database Setup (Supabase)

### Create Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Wait for setup (2-3 minutes)

### Get Connection String

Settings → Database → Connection string → URI

Format:
```
postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres?pgbouncer=true
```

### Run Migrations

```bash
# Set DATABASE_URL
export DATABASE_URL="postgresql://..."

# Run migrations
cd apps/api
pnpm prisma:deploy
```

## 🔄 CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build API
        run: pnpm --filter @petra/api build
      
      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
  
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 🔐 Secrets Management

### Vercel

```bash
# Add secrets
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

### Railway

```bash
# Add secrets via CLI
railway variables set STRIPE_SECRET_KEY=sk_live_...
```

## 🧪 Staging Environment

### Option 1: Separate Projects

- **Staging**: `petra-staging.vercel.app`
- **Production**: `petra.com`

### Option 2: Preview Deployments

- Every PR gets a preview URL on Vercel
- Test before merging to main

## 📊 Monitoring

### Recommended Tools

1. **Vercel Analytics** (included)
2. **Railway Logs** (included)
3. **Sentry** (error tracking)
   ```bash
   pnpm add @sentry/nextjs @sentry/node
   ```
4. **LogRocket** (session replay)

### Health Checks

```bash
# API Health
curl https://your-api.railway.app/health

# Frontend
curl -I https://petra-marketing.vercel.app
```

## 🔥 Rollback

### Vercel

```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]
```

### Railway

```bash
# Rollback to previous deployment
railway rollback
```

## ⚡ Performance Optimization

### Frontend

1. **Enable Edge Runtime** (where possible)
2. **Use Static Generation** for marketing pages
3. **Optimize Images**: Use `next/image`
4. **Enable Compression**: Gzip/Brotli
5. **Use CDN**: Vercel Edge Network

### Backend

1. **Enable Connection Pooling**: PgBouncer (Supabase)
2. **Add Redis Caching**: Upstash
3. **Use Database Indexes**: Prisma
4. **Enable GZIP**: NestJS compression
5. **Rate Limiting**: Express rate limit

## 🔒 Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Set secure CORS origins
- [ ] Enable Stripe webhook signature verification
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Set secure headers (helmet.js)
- [ ] Regular dependency updates
- [ ] Database backups (automated on Supabase)

## 💰 Cost Estimation (Monthly)

### Free Tier

- **Vercel**: Free (Hobby)
- **Railway**: $5 credit/month
- **Supabase**: Free (up to 500MB)
- **Total**: ~$0-5/month

### Production (Medium Scale)

- **Vercel Pro**: $20
- **Railway**: $20-50
- **Supabase Pro**: $25
- **Upstash Redis**: $10
- **Cloudflare R2**: $5
- **Total**: ~$80-110/month

## 🚨 Troubleshooting

### Build Fails

```bash
# Clear cache
pnpm clean
rm -rf .turbo

# Rebuild
pnpm build
```

### Database Migrations Fail

```bash
# Reset and re-run
pnpm prisma migrate reset
pnpm prisma:deploy
```

### Stripe Webhooks Not Working

1. Check webhook URL in Stripe Dashboard
2. Verify webhook secret in env vars
3. Check logs for signature errors

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)

## ✅ Pre-Launch Checklist

- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Stripe webhooks configured
- [ ] SSL certificates active
- [ ] Custom domain configured
- [ ] Error tracking enabled
- [ ] Analytics set up
- [ ] Backups configured
- [ ] Load testing completed
- [ ] Security audit done

