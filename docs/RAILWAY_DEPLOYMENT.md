# 🚂 Railway Deployment Guide - Petra Platform API

Complete step-by-step guide to deploy your NestJS API to Railway.

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ GitHub account with access to petra-platform repository
- ✅ Railway account (create at [railway.app](https://railway.app))
- ✅ Supabase database set up and accessible
- ✅ Stripe account with API keys
- ✅ All environment variables documented (see below)

---

## 🎯 Deployment Steps

### **Step 1: Prepare Your Repository**

1. **Commit all changes:**
   ```bash
   cd /Users/mattiapapa/Code/petra/petra-platform
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

2. **Verify your Dockerfile:**
   Your `apps/api/Dockerfile` is already perfect for Railway! ✅

---

### **Step 2: Create Railway Project**

1. **Go to Railway:**
   - Visit [railway.app](https://railway.app)
   - Click **"Login"** and sign in with GitHub

2. **Create New Project:**
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Choose **petra-platform** repository
   - Railway will scan your repo and detect services

3. **Configure Service:**
   - Railway should auto-detect your `apps/api/Dockerfile`
   - If prompted, set:
     - **Root Directory:** `apps/api` (or leave blank if it auto-detects)
     - **Dockerfile Path:** `apps/api/Dockerfile`
     - **Build Command:** (leave blank - Dockerfile handles it)
     - **Start Command:** (leave blank - Dockerfile handles it)

---

### **Step 3: Configure Environment Variables**

In Railway dashboard, click on your service → **"Variables"** tab → Add these:

#### **Required Environment Variables:**

```bash
# Node Environment
NODE_ENV=production
PORT=3001

# Database (Supabase with SSL)
DATABASE_URL=postgresql://prisma:your_password@db.iglnqcndfzktzaqdtumv.supabase.co:5432/postgres?sslmode=require

# Frontend URL (update after deploying frontend)
FRONTEND_URL=https://your-frontend-domain.com

# JWT Authentication (CRITICAL - generate a secure secret!)
JWT_SECRET=your_super_secure_jwt_secret_at_least_32_characters_long

# Stripe Keys (use test keys first, then production)
STRIPE_SECRET_KEY=sk_test_... or sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs - Woman Plans
PRICE_ID_W_STARTER_6W=price_...
PRICE_ID_W_STARTER_18W=price_...
PRICE_ID_W_STARTER_36W=price_...
PRICE_ID_W_PREMIUM_6W=price_...
PRICE_ID_W_PREMIUM_18W=price_...
PRICE_ID_W_PREMIUM_36W=price_...

# Stripe Price IDs - Man Plans
PRICE_ID_M_STARTER_6W=price_...
PRICE_ID_M_STARTER_18W=price_...
PRICE_ID_M_STARTER_36W=price_...
PRICE_ID_M_PREMIUM_6W=price_...
PRICE_ID_M_PREMIUM_18W=price_...
PRICE_ID_M_PREMIUM_36W=price_...

# Email Service (Resend)
RESEND_API_KEY=re_...

# Admin Notifications
ADMIN_EMAILS=admin@coachingpetra.com

# Rate Limiting (Optional - uses defaults if not set)
THROTTLE_TTL=60000
THROTTLE_LIMIT=100

# hCaptcha (Optional - if using captcha)
HCAPTCHA_SECRET_KEY=0x...
```

#### **How to Add Variables in Railway:**

1. Click **"Variables"** tab in your service
2. Click **"+ New Variable"**
3. Paste all variables at once (Railway supports bulk paste)
4. Click **"Add"**

---

### **Step 4: Generate Secure JWT Secret**

**Don't use a simple password!** Generate a cryptographically secure secret:

**Option 1: Using Node.js (in terminal):**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Option 2: Using OpenSSL:**
```bash
openssl rand -hex 64
```

**Option 3: Online (use carefully):**
- Visit: https://generate-random.org/api-key-generator
- Length: 64 characters
- Copy and use as `JWT_SECRET`

---

### **Step 5: Deploy**

1. **Trigger Deployment:**
   - After adding environment variables, Railway will automatically start deploying
   - Or click **"Deploy"** button

2. **Monitor Deployment:**
   - Click **"Deployments"** tab
   - Watch the build logs in real-time
   - Build should complete in 3-5 minutes

3. **Check Build Logs:**
   ```
   ✅ Building Docker image...
   ✅ Installing dependencies...
   ✅ Building packages...
   ✅ Generating Prisma Client...
   ✅ Running migrations...
   ✅ Starting application...
   ```

---

### **Step 6: Get Your API URL**

1. **In Railway Dashboard:**
   - Click on your service
   - Click **"Settings"** tab
   - Scroll to **"Domains"**
   - Click **"Generate Domain"**
   - Railway will provide a domain like: `petra-api-production.up.railway.app`

2. **Copy this URL** - you'll need it for:
   - Frontend `NEXT_PUBLIC_API_URL`
   - Stripe webhook configuration
   - Testing

---

### **Step 7: Configure Custom Domain (Optional)**

If you have a domain (e.g., `api.coachingpetra.com`):

1. **In Railway:**
   - Go to **Settings → Domains**
   - Click **"Custom Domain"**
   - Enter: `api.coachingpetra.com`

2. **In Your DNS Provider:**
   - Add a CNAME record:
     - Name: `api`
     - Value: `petra-api-production.up.railway.app` (or provided CNAME)
     - TTL: 3600

3. **Wait for DNS propagation** (5-30 minutes)

4. **SSL Certificate:**
   - Railway automatically provisions SSL via Let's Encrypt
   - Your API will be available at `https://api.coachingpetra.com`

---

### **Step 8: Configure Stripe Webhooks**

1. **Go to Stripe Dashboard:**
   - Navigate to **Developers → Webhooks**
   - Click **"Add endpoint"**

2. **Configure Webhook:**
   - **Endpoint URL:** `https://your-railway-domain.up.railway.app/stripe/webhook`
   - **Events to send:**
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

3. **Copy Webhook Secret:**
   - After creating, Stripe shows: `whsec_...`
   - Update Railway environment variable: `STRIPE_WEBHOOK_SECRET=whsec_...`

---

### **Step 9: Test Your API**

#### **Health Check:**
```bash
curl https://your-railway-domain.up.railway.app/
```

Expected response:
```json
{
  "message": "Welcome to Petra Platform API",
  "status": "ok"
}
```

#### **Test Plans Endpoint:**
```bash
curl https://your-railway-domain.up.railway.app/plans
```

Expected: List of subscription plans

#### **Test Auth Endpoint:**
```bash
curl -X POST https://your-railway-domain.up.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrongpassword"}'
```

Expected: 401 Unauthorized (proves auth is working)

---

### **Step 10: Set Up Automatic Deployments**

Railway automatically deploys when you push to `main` branch:

```bash
# Make a change
git add .
git commit -m "Update API"
git push origin main

# Railway automatically:
# 1. Detects push
# 2. Builds new image
# 3. Runs migrations
# 4. Deploys new version
# 5. Zero-downtime deployment ✨
```

---

## 🔍 Monitoring & Debugging

### **View Logs:**

1. **In Railway Dashboard:**
   - Click on your service
   - Click **"Logs"** tab
   - View real-time logs

2. **Filter logs:**
   - Click filter icon
   - Filter by severity: Info, Warn, Error

### **View Metrics:**

1. **In Railway Dashboard:**
   - Click **"Metrics"** tab
   - View:
     - CPU usage
     - Memory usage
     - Network traffic
     - Request count

### **Common Issues:**

#### **Build Fails:**
```
Error: Cannot find module '@petra/types'
```

**Solution:** Railway might not be installing workspace dependencies properly.
Check that your root `package.json` and `pnpm-workspace.yaml` are committed.

#### **Database Connection Error:**
```
Error: Can't reach database server at db.iglnqcndfzktzaqdtumv.supabase.co
```

**Solution:**
1. Check `DATABASE_URL` is correct
2. Verify Supabase allows connections (check Network Restrictions)
3. Ensure SSL mode is set: `?sslmode=require`

#### **Port Issues:**
```
Error: Port 3001 is already in use
```

**Solution:** Railway automatically assigns a port via `$PORT` env var.
Your app already uses `process.env.PORT || 3001` ✅

---

## 🚀 Performance Optimization

### **Set Resource Limits:**

1. **In Railway Dashboard:**
   - Go to **Settings → Resources**
   - Set appropriate limits:
     - **Memory:** Start with 512MB (adjust based on usage)
     - **CPU:** Shared (upgrade if needed)

### **Enable Health Checks:**

Railway automatically monitors your app. To add custom health check:

In your `main.ts`, ensure you have a health endpoint:
```typescript
app.get('/health', (req, res) => res.json({ status: 'ok' }));
```

---

## 💰 Cost Estimation

Based on your API (NestJS + Prisma):

```
Expected Monthly Cost:
├─ Memory: 512MB constant
├─ CPU: Minimal (REST API)
├─ Network: ~1-2GB egress/month
└─ Total: ~$2-4/month

Railway Credits:
├─ Free: $5/month credit
├─ Pro: $20/month credit
└─ Your API is likely FREE! 🎉
```

**Monitor usage:**
- Railway Dashboard → Billing → Usage

---

## 🔄 Rollback & Deployment History

### **Rollback to Previous Version:**

1. **In Railway Dashboard:**
   - Click **"Deployments"** tab
   - Find previous successful deployment
   - Click **"⋯"** menu
   - Click **"Redeploy"**

### **View Deployment History:**
- All deployments are logged with:
  - Git commit hash
  - Deployment time
  - Status (success/failed)
  - Logs

---

## 📝 Post-Deployment Checklist

After successful deployment:

- [ ] API is accessible at Railway domain
- [ ] Database migrations ran successfully
- [ ] Health check returns 200 OK
- [ ] Stripe webhooks configured and receiving events
- [ ] JWT authentication working (test login)
- [ ] Email activation working
- [ ] CORS configured for frontend domain
- [ ] SSL certificate active (https://)
- [ ] Logs showing no errors
- [ ] Metrics dashboard showing normal resource usage
- [ ] Custom domain configured (if applicable)
- [ ] Updated frontend `NEXT_PUBLIC_API_URL`
- [ ] Monitoring/alerts set up (optional)

---

## 🔗 Useful Links

- **Railway Dashboard:** https://railway.app/dashboard
- **Railway Docs:** https://docs.railway.app
- **Supabase Dashboard:** https://app.supabase.com
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Your API:** `https://your-domain.up.railway.app`

---

## 🆘 Need Help?

1. **Railway Community:**
   - Discord: https://discord.gg/railway
   - Help Center: https://help.railway.app

2. **Check Logs:**
   - Railway Dashboard → Service → Logs

3. **Check Metrics:**
   - Railway Dashboard → Service → Metrics

4. **Deployment Logs:**
   - Railway Dashboard → Service → Deployments → [Latest] → View Logs

---

**Last Updated:** January 2025

Good luck with your deployment! 🚀

