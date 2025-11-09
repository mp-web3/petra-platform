# Railway Deployment with Railpack

Simple, zero-config deployment for the Petra Platform API using Railway's Railpack builder.

## Prerequisites

- Railway account
- Supabase PostgreSQL database (already set up)
- API keys (Stripe, Resend)

---

## 1. Railway Project Setup

### Create New Service

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **New Project**
3. Select **Deploy from GitHub repo**
4. Choose your `petra-platform` repository
5. Click **Add Service** → **GitHub Repo**

---

## 2. Service Configuration

Railway will auto-detect your Node.js project using Railpack.

### Settings to Configure

Go to your service **Settings** tab:

#### **Root Directory**
```
apps/api
```

#### **Build Command** (optional - Railpack handles this)
```
pnpm install --frozen-lockfile && pnpm prisma:generate && pnpm build
```

#### **Start Command**
```
sh -c "pnpm prisma:deploy && node dist/main.js"
```

#### **Install Command** (if needed)
```
pnpm install --frozen-lockfile
```

---

## 3. Environment Variables

Go to **Variables** tab and add:

### Required Variables

```bash
# Database
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require

railway# JWT (REQUIRED for production)
# Generate a strong random secret: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
RESEND_API_KEY=re_...

# Frontend URL
FRONTEND_URL=https://your-frontend.vercel.app

# Node Environment
NODE_ENV=production
```

### Get Your Supabase Connection String

1. Go to Supabase Dashboard
2. Project Settings → Database
3. Use **Connection String** (Transaction mode)
4. Add `?sslmode=require` at the end

---

## 4. Deploy

### First Deployment

1. Click **Deploy** in Railway
2. Watch the build logs
3. Railpack will automatically:
   - Detect Node.js
   - Install pnpm dependencies
   - Build your TypeScript
   - Start the server

### Check Logs

Monitor the deployment:
- Build logs: Check for errors
- Deploy logs: Verify server starts
- Look for: `Nest application successfully started`

---

## 5. Database Migration

Your start command already includes `pnpm prisma:deploy`, which runs migrations automatically on each deployment.

If you need to run migrations manually:

```bash
# In Railway Shell (Settings → Shell)
pnpm prisma:migrate deploy
```

---

## 6. Health Check

### Test Your API

Once deployed, Railway will give you a URL like:
```
https://your-service.railway.app
```

Test the health endpoint:
```bash
curl https://your-service.railway.app/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-11-09T...",
  "database": "connected"
}
```

---

## 7. Custom Domain (Optional)

### Add Custom Domain

1. Go to **Settings** → **Domains**
2. Click **Generate Domain** (free Railway domain)
3. Or add your custom domain:
   - Click **Custom Domain**
   - Enter your domain: `api.yourdomain.com`
   - Add CNAME record in your DNS provider

---

## 8. Troubleshooting

### Build Fails

**Check Railpack is being used:**
- Settings → Builder should show "Railpack"
- If it shows Docker, remove any Dockerfile references

**Check logs for errors:**
- Look for module resolution issues
- Verify all workspace packages are installed

### Runtime Errors

**Database connection fails:**
- Verify `DATABASE_URL` in environment variables
- Check Supabase allows connections from Railway
- Ensure `?sslmode=require` is added

**Module not found:**
- Check all `@petra/` packages are in `pnpm-workspace.yaml`
- Verify `pnpm install --frozen-lockfile` is running

**Port issues:**
- Railway automatically sets `PORT` environment variable
- Your app should use `process.env.PORT` or default to 3000

---

## 9. Monitoring

### View Logs

Real-time logs in Railway dashboard:
```
Settings → Logs
```

### Check Metrics

Monitor your service:
- CPU usage
- Memory usage
- Request count

---

## 10. Updates & Redeployments

### Automatic Deployments

Railway automatically deploys when you push to your main branch.

### Manual Deployment

1. Make changes locally
2. Commit and push:
   ```bash
   git add .
   git commit -m "Update API"
   git push origin main
   ```
3. Railway detects changes and redeploys automatically

### Rollback

If something goes wrong:
1. Go to **Deployments** tab
2. Find a previous successful deployment
3. Click **⋯** → **Redeploy**

---

## Benefits of Railpack vs Docker

✅ **Zero configuration** - No Dockerfile needed  
✅ **Automatic detection** - Railpack detects Node.js, pnpm, TypeScript  
✅ **Better monorepo support** - Handles workspace packages natively  
✅ **Faster builds** - Optimized caching  
✅ **Simpler debugging** - Clearer error messages  

---

## Environment Variables Reference

| Variable                | Description                                            | Example                                  |
| ----------------------- | ------------------------------------------------------ | ---------------------------------------- |
| `DATABASE_URL`          | Supabase PostgreSQL connection string                  | `postgresql://postgres:...`              |
| `JWT_SECRET`            | Secret for JWT token signing (required for production) | Generate with: `openssl rand -base64 32` |
| `STRIPE_SECRET_KEY`     | Stripe API secret key                                  | `sk_test_...`                            |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret                          | `whsec_...`                              |
| `RESEND_API_KEY`        | Resend email API key                                   | `re_...`                                 |
| `FRONTEND_URL`          | Frontend application URL                               | `https://petra.vercel.app`               |
| `NODE_ENV`              | Node environment                                       | `production`                             |
| `PORT`                  | Server port (auto-set by Railway)                      | `3000`                                   |

---

## Next Steps

1. ✅ Deploy API to Railway
2. ⬜ Deploy frontend to Vercel
3. ⬜ Configure Stripe webhooks
4. ⬜ Set up custom domains
5. ⬜ Configure monitoring/alerts

---

## Support

- [Railway Documentation](https://docs.railway.app)
- [Railpack Documentation](https://railpack.com)
- [Railway Discord](https://discord.gg/railway)

