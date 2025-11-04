# 🚀 Quick Start Guide

## Prerequisites

1. **Database Migration** (CRITICAL - Must do first!):
   ```bash
   cd apps/api
   npx prisma migrate dev --name add_activation_system
   npx prisma generate
   ```

2. **Environment Variables**:

   **API** (`apps/api/.env`):
   ```env
   JWT_SECRET=your-super-secret-key-change-in-production
   DATABASE_URL=postgresql://...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   RESEND_API_KEY=re_...
   FRONTEND_URL=http://localhost:3000
   ```

   **Frontend** (`apps/web-coaching/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Build API Client**:
   ```bash
   cd packages/api-client
   pnpm build
   ```

---

## 🎯 Testing Complete Flow

### Step 1: Start Services

**Terminal 1 - API:**
```bash
cd apps/api
pnpm dev
# Should start on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd apps/web-coaching
pnpm dev
# Should start on http://localhost:3002
```

**Terminal 3 - Stripe CLI:**
```bash
stripe listen --forward-to localhost:3001/api/stripe/webhook
```

---

### Step 2: Complete Checkout

1. Go to `http://localhost:3000` (marketing site)
2. Complete a test checkout
3. Use test card: `4242 4242 4242 4242`
4. Check API logs - should see user/order created

---

### Step 3: Activate Account

**Option A: Check Email** (if Resend is configured)
- Check email inbox for activation link
- Click link → set password

**Option B: Manual Activation** (for testing)
```bash
# 1. Get token from database
psql $DATABASE_URL -c "SELECT token, userId FROM activation_tokens ORDER BY createdAt DESC LIMIT 1;"

# 2. Activate via API
curl -X POST http://localhost:3001/api/auth/activate \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_TOKEN",
    "userId": "YOUR_USER_ID",
    "password": "SecurePass123",
    "name": "Test User"
  }'
```

---

### Step 4: Login

1. Go to `http://localhost:3002/login`
2. Enter email and password
3. Should redirect to `/dashboard`

---

### Step 5: Manage Subscription

1. Navigate to `/dashboard/subscription`
2. View subscription details
3. Test cancel/reactivate buttons

---

## ✅ Verification Checklist

- [ ] Database migration completed
- [ ] Prisma client generated
- [ ] JWT_SECRET set in .env
- [ ] API client built
- [ ] API running on :3001
- [ ] Frontend running on :3002
- [ ] Can complete checkout
- [ ] Can activate account
- [ ] Can login
- [ ] Can view subscription
- [ ] Can cancel subscription
- [ ] Can reactivate subscription

---

## 🐛 Troubleshooting

### "Property 'password' does not exist"
**Fix**: Run `npx prisma migrate dev` and `npx prisma generate`

### "JWT_SECRET is not defined"
**Fix**: Add `JWT_SECRET` to `apps/api/.env`

### "Cannot find module '@chakra-ui/react'"
**Fix**: This is a path alias - ensure `packages/ui` exists or adjust imports

### "401 Unauthorized" on login
**Check**:
- Account is activated (has password)
- Email/password are correct
- JWT_SECRET matches in API

### Frontend can't connect to API
**Check**:
- `NEXT_PUBLIC_API_URL` is set correctly
- API is running on correct port
- CORS is enabled in API

---

**Ready to test!** 🎉
