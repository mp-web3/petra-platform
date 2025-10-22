# 🧪 Testing Checkout Flow - Quick Start Guide

This guide will help you set up and test the complete checkout flow locally.

---

## 📋 Prerequisites Checklist

- [ ] PostgreSQL database running (local or Supabase)
- [ ] Stripe account (test mode)
- [ ] Stripe CLI installed (for webhooks)

---

## 1️⃣ Set Up Database

### Option A: Using Supabase (Recommended)

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Settings → Database → Connection String**
4. Copy the **Connection pooling** string (port 6543)
5. Replace `[YOUR-PASSWORD]` with your database password
6. Paste into `apps/api/.env` as `DATABASE_URL`

### Option B: Local PostgreSQL

```bash
# Install PostgreSQL (if not installed)
brew install postgresql@15

# Start PostgreSQL
brew services start postgresql@15

# Create database
createdb petra

# Update DATABASE_URL in apps/api/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/petra?schema=public"
```

---

## 2️⃣ Set Up Stripe

### Step 1: Get API Keys

1. Go to [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
2. Copy **Publishable key** (starts with `pk_test_`)
   - Paste into `apps/web-marketing/.env.local` as `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Copy **Secret key** (starts with `sk_test_`)
   - Paste into `apps/api/.env` as `STRIPE_SECRET_KEY`

### Step 2: Create Products and Prices

1. Go to [https://dashboard.stripe.com/test/products](https://dashboard.stripe.com/test/products)
2. Click **+ Add product** for each plan:

#### Woman Starter Plans:
- **Product Name**: "Coaching Donna Starter 6 Settimane"
  - **Price**: €147 (one-time payment)
  - Copy the price ID → `PRICE_ID_W_STARTER_6W`
  
- **Product Name**: "Coaching Donna Starter 18 Settimane"
  - **Price**: €397 (one-time payment)
  - Copy the price ID → `PRICE_ID_W_STARTER_18W`
  
- **Product Name**: "Coaching Donna Starter 36 Settimane"
  - **Price**: €697 (one-time payment)
  - Copy the price ID → `PRICE_ID_W_STARTER_36W`

#### Woman Premium Plans:
- **Product Name**: "Coaching Donna Premium 6 Settimane"
  - **Price**: €247 (one-time payment)
  - Copy the price ID → `PRICE_ID_W_PREMIUM_6W`
  
- **Product Name**: "Coaching Donna Premium 18 Settimane"
  - **Price**: €647 (one-time payment)
  - Copy the price ID → `PRICE_ID_W_PREMIUM_18W`
  
- **Product Name**: "Coaching Donna Premium 36 Settimane"
  - **Price**: €1147 (one-time payment)
  - Copy the price ID → `PRICE_ID_W_PREMIUM_36W`

3. Paste all price IDs into `apps/api/.env`

### Step 3: Set Up Webhooks (for local testing)

#### Install Stripe CLI
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Or download from: https://stripe.com/docs/stripe-cli
```

#### Login to Stripe
```bash
stripe login
```

#### Forward webhooks to local server
```bash
# Run this in a SEPARATE terminal window and keep it running
stripe listen --forward-to localhost:3001/stripe/webhook
```

This will output a webhook signing secret (starts with `whsec_`). Copy it and paste into `apps/api/.env` as `STRIPE_WEBHOOK_SECRET`.

---

## 3️⃣ Initialize Database

```bash
cd /Users/mattiapapa/Code/petra/petra-platform

# Generate Prisma Client
pnpm --filter @petra/api exec prisma generate

# Run database migrations
pnpm --filter @petra/api exec prisma db push

# (Optional) Open Prisma Studio to view database
pnpm --filter @petra/api exec prisma studio
```

---

## 4️⃣ Start All Services

Open **3 terminal windows**:

### Terminal 1: Backend API
```bash
cd /Users/mattiapapa/Code/petra/petra-platform
pnpm --filter @petra/api dev
```
Should see: `🚀 Server running on http://localhost:3001`

### Terminal 2: Frontend
```bash
cd /Users/mattiapapa/Code/petra/petra-platform
pnpm --filter @petra/web-marketing dev
```
Should see: `✓ Ready on http://localhost:3000`

### Terminal 3: Stripe Webhook Forwarding
```bash
stripe listen --forward-to localhost:3001/stripe/webhook
```
Should see: `Ready! Your webhook signing secret is whsec_xxx`

---

## 5️⃣ Test the Checkout Flow

### Step 1: Browse Plans
1. Open browser: [http://localhost:3000](http://localhost:3000)
2. Click navigation menu
3. Go to **"Coaching Donna"**
4. Scroll down to **"Scegli il tuo piano"** section

### Step 2: Select a Plan
1. Click **"Inizia Ora"** on any plan
2. You'll be redirected to the **Preview Order** page
3. Review the plan details

### Step 3: Checkout
1. Click **"Procedi al Pagamento"**
2. You'll be redirected to **Stripe Checkout**
3. Use test card details:
   - **Card**: `4242 4242 4242 4242`
   - **Expiry**: Any future date (e.g., `12/34`)
   - **CVC**: Any 3 digits (e.g., `123`)
   - **Email**: Your test email
4. Click **Pay**

### Step 4: Verify Success
1. After payment, you'll be redirected to **Success Page**
2. Check backend logs for webhook events
3. Check Stripe dashboard for the payment
4. Check Prisma Studio for the Order record

---

## 6️⃣ Verify Everything Works

### Check Backend Logs
You should see:
```
✅ Webhook received: checkout.session.completed
✅ Order created in database
```

### Check Stripe Dashboard
1. Go to [https://dashboard.stripe.com/test/payments](https://dashboard.stripe.com/test/payments)
2. You should see your test payment

### Check Database
```bash
# Open Prisma Studio
pnpm --filter @petra/api exec prisma studio
```
- Go to **Order** table
- You should see the new order

---

## 🧪 Test Cards

Stripe provides many test cards for different scenarios:

| Card Number           | Description                       |
| --------------------- | --------------------------------- |
| `4242 4242 4242 4242` | Success (default)                 |
| `4000 0025 0000 3155` | Requires 3D Secure authentication |
| `4000 0000 0000 9995` | Card declined                     |
| `4000 0000 0000 0002` | Generic decline                   |

More test cards: [https://stripe.com/docs/testing](https://stripe.com/docs/testing)

---

## 🐛 Troubleshooting

### Backend not starting?
- Check if port 3001 is available: `lsof -i :3001`
- Check DATABASE_URL is correct
- Run `pnpm install` in the root

### Frontend not connecting to backend?
- Verify `NEXT_PUBLIC_API_URL=http://localhost:3001` in `.env.local`
- Check browser console for CORS errors
- Restart frontend dev server

### Stripe webhook not working?
- Make sure Stripe CLI is running: `stripe listen --forward-to localhost:3001/stripe/webhook`
- Verify `STRIPE_WEBHOOK_SECRET` in `apps/api/.env`
- Check backend logs for webhook errors

### Database connection errors?
- If using Supabase, check if IP is whitelisted
- Test connection: `pnpm --filter @petra/api exec prisma db pull`
- Check if PostgreSQL is running (local): `brew services list`

### Checkout button not working?
- Check browser console for errors
- Verify all PRICE_IDs are set in `apps/api/.env`
- Check backend logs for API errors

---

## 📊 Monitoring

### Backend API Health Check
```bash
curl http://localhost:3001
# Should return: {"message":"Hello World!","timestamp":"..."}
```

### Frontend Health Check
```bash
curl http://localhost:3000
# Should return HTML
```

### Database Connection
```bash
pnpm --filter @petra/api exec prisma studio
# Opens database viewer at http://localhost:5555
```

---

## 🎉 Success Checklist

- [ ] Backend running on port 3001
- [ ] Frontend running on port 3000
- [ ] Stripe CLI forwarding webhooks
- [ ] Can browse to coaching page
- [ ] Can click "Inizia Ora" and see preview
- [ ] Can complete checkout with test card
- [ ] Redirected to success page
- [ ] Order appears in database
- [ ] Payment appears in Stripe dashboard

---

## 🚀 Next Steps

Once everything is working:

1. **Customize plans** - Update pricing and features in `packages/utils/src/constants/plans.ts`
2. **Add man plans** - Create products in Stripe and add price IDs
3. **Customize emails** - Set up email sending after successful checkout
4. **Deploy** - Follow `docs/DEPLOYMENT.md` for production deployment
5. **Production webhooks** - Set up real webhooks on Railway/production

---

## 📚 Useful Commands

```bash
# Restart everything
pnpm --filter @petra/api dev     # Terminal 1
pnpm --filter @petra/web-marketing dev  # Terminal 2
stripe listen --forward-to localhost:3001/stripe/webhook  # Terminal 3

# View logs
# Backend logs are in Terminal 1
# Frontend logs are in Terminal 2
# Stripe webhook logs are in Terminal 3

# Database management
pnpm --filter @petra/api exec prisma studio  # View database
pnpm --filter @petra/api exec prisma db push # Update schema
pnpm --filter @petra/api exec prisma generate # Generate client

# Clean and reinstall
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
```

---

**Happy testing! 🎊**

