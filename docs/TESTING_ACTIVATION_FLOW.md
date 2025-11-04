# 🧪 Testing the Complete Activation Flow

This guide walks you through testing the entire checkout → activation flow, including webhooks, emails, and account activation.

## 📋 Prerequisites

Before testing, ensure you have:

1. **Database Migration**
   ```bash
   cd apps/api
   npx prisma migrate dev --name add_activation_tokens
   ```

2. **Environment Variables** (`.env` in `apps/api`)
   ```env
   DATABASE_URL="postgresql://..."
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   RESEND_API_KEY="re_..."
   FRONTEND_URL="http://localhost:3000"
   ```

3. **Dependencies Installed**
   ```bash
   pnpm install
   ```

4. **Services Running**
   - API: `cd apps/api && pnpm dev` (port 3001)
   - Stripe CLI: `stripe listen --forward-to localhost:3001/api/stripe/webhook`
   - Frontend (optional): `cd apps/web-marketing && pnpm dev`

---

## 🔄 Complete Flow Overview

```
1. User completes checkout → Stripe webhook fires
2. Webhook creates User + Order + sends emails
3. User receives activation email with token
4. User clicks activation link → Frontend page
5. User sets password → POST /api/auth/activate
6. Account activated → User can log in
```

---

## 🧪 Step-by-Step Testing Guide

### Step 1: Trigger Checkout Session (Simulate Purchase)

#### Option A: Use Stripe Test Mode

1. **Create a test checkout session** (via your frontend or API):
   ```bash
   curl -X POST http://localhost:3001/api/checkout/session \
     -H "Content-Type: application/json" \
     -d '{
       "planId": "woman-starter-6w",
       "email": "test@example.com",
       "acceptedTos": true,
       "acceptedPrivacy": true,
       "disclosureTosVersion": "v1.0",
       "disclosurePrivacyVersion": "v1.0",
       "marketingOptIn": false
     }'
   ```

2. **Complete checkout** using the returned Stripe session URL
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any CVC

#### Option B: Use Stripe CLI (Recommended for Testing)

```bash
# Simulate checkout.session.completed event
stripe trigger checkout.session.completed \
  --add checkout.session:customer_email=test@example.com \
  --add checkout.session:id=cs_test_123 \
  --add checkout.session:amount_total=2999 \
  --add checkout.session:currency=eur \
  --add checkout.session:metadata[planId]=woman-starter-6w \
  --add checkout.session:metadata[tosAccepted]=true \
  --add checkout.session:metadata[privacyAccepted]=true
```

---

### Step 2: Verify Webhook Processing

**Check API logs** - you should see:
```
📨 Stripe webhook received: checkout.session.completed
✅ Checkout completed: cs_test_...
🔄 Processing checkout for: test@example.com
➕ Creating new user (guest checkout)
✅ User created: user_xxx
📦 Order created: order_xxx
✅ Consent recorded
✅ Order confirmation email sent and logged: email_xxx
📧 New user - sending account activation email
✅ Account activation email sent and logged: email_yyy
🎉 Checkout processing complete!
```

**Verify Database**:
```sql
-- Check user was created
SELECT id, email, password, emailVerified, activatedAt 
FROM users 
WHERE email = 'test@example.com';

-- Should show:
-- password: NULL
-- emailVerified: false
-- activatedAt: NULL

-- Check order was created
SELECT id, userId, planId, status, signUpStatus 
FROM orders 
WHERE userId = (SELECT id FROM users WHERE email = 'test@example.com');

-- Should show:
-- status: 'COMPLETED'
-- signUpStatus: 'PENDING'

-- Check activation token was created
SELECT token, userId, expiresAt, usedAt 
FROM activation_tokens 
WHERE userId = (SELECT id FROM users WHERE email = 'test@example.com');

-- Should show:
-- token: (long base64 string)
-- expiresAt: (7 days from now)
-- usedAt: NULL
```

---

### Step 3: Check Email Delivery

**Check Resend Dashboard**:
1. Go to https://resend.com/emails
2. You should see two emails sent:
   - **Order Confirmation** (type: TRANSACTIONAL)
   - **Account Activation** (type: SIGNUP)

**Check Activation Email Content**:
- Should contain link: `http://localhost:3000/activate?token=xxx&userId=yyy`
- Token should be a long base64 string
- Expiration notice: "Questo link scade tra 24 ore" (This link expires in 24 hours)

**Check EmailLog**:
```sql
SELECT emailType, recipientEmail, status, providerId 
FROM email_logs 
WHERE orderId = (SELECT id FROM orders WHERE userId = (SELECT id FROM users WHERE email = 'test@example.com'));

-- Should show 2 rows:
-- 1. emailType: 'TRANSACTIONAL', status: 'SENT'
-- 2. emailType: 'SIGNUP', status: 'SENT'
```

---

### Step 4: Test Activation Endpoint

**Extract Token from Database**:
```sql
SELECT token, userId 
FROM activation_tokens 
WHERE userId = (SELECT id FROM users WHERE email = 'test@example.com')
AND usedAt IS NULL
ORDER BY createdAt DESC
LIMIT 1;
```

**Test Activation API**:
```bash
curl -X POST http://localhost:3001/api/auth/activate \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_TOKEN_FROM_DB",
    "userId": "YOUR_USER_ID_FROM_DB",
    "name": "Test User",
    "password": "SecurePass123"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Account activated successfully",
  "user": {
    "id": "user_xxx",
    "email": "test@example.com",
    "name": "Test User",
    "emailVerified": true,
    "activatedAt": "2025-01-30T12:00:00.000Z"
  }
}
```

**Verify Database After Activation**:
```sql
-- User should now have password (hashed) and be activated
SELECT id, email, name, password IS NOT NULL as hasPassword, emailVerified, activatedAt 
FROM users 
WHERE email = 'test@example.com';

-- Should show:
-- hasPassword: true
-- emailVerified: true
-- activatedAt: (current timestamp)

-- Token should be marked as used
SELECT token, usedAt 
FROM activation_tokens 
WHERE userId = (SELECT id FROM users WHERE email = 'test@example.com');

-- Should show:
-- usedAt: (current timestamp)

-- Order signUpStatus should be updated
SELECT signUpStatus 
FROM orders 
WHERE userId = (SELECT id FROM users WHERE email = 'test@example.com');

-- Should show:
-- signUpStatus: 'ACTIVATED'
```

---

### Step 5: Test Error Scenarios

#### Test 1: Invalid Token
```bash
curl -X POST http://localhost:3001/api/auth/activate \
  -H "Content-Type: application/json" \
  -d '{
    "token": "invalid_token",
    "userId": "user_xxx",
    "password": "SecurePass123"
  }'
```

**Expected**: `400 Bad Request - Invalid activation token`

#### Test 2: Expired Token
```sql
-- Manually expire a token (for testing)
UPDATE activation_tokens 
SET expiresAt = NOW() - INTERVAL '1 day'
WHERE userId = 'user_xxx' AND usedAt IS NULL;
```

Then try activation - should return: `Activation token has expired`

#### Test 3: Already Used Token
```bash
# Try activating with same token twice
```

**Expected**: `This activation link has already been used`

#### Test 4: Weak Password
```bash
curl -X POST http://localhost:3001/api/auth/activate \
  -H "Content-Type: application/json" \
  -d '{
    "token": "valid_token",
    "userId": "user_xxx",
    "password": "weak"
  }'
```

**Expected**: Validation error about password requirements

#### Test 5: Mismatched User ID
```bash
curl -X POST http://localhost:3001/api/auth/activate \
  -H "Content-Type: application/json" \
  -d '{
    "token": "token_for_user_a",
    "userId": "user_b",
    "password": "SecurePass123"
  }'
```

**Expected**: `Token does not match user ID`

#### Test 6: Already Activated Account
```bash
# Try activating account that already has password
```

**Expected**: `Account is already activated`

---

### Step 6: Test Subscription Creation

**Trigger subscription.created event**:
```bash
stripe trigger customer.subscription.created \
  --add subscription:customer=cus_test_xxx \
  --add subscription:id=sub_test_xxx \
  --add subscription:current_period_start=$(date +%s) \
  --add subscription:current_period_end=$(($(date +%s) + 7776000))
```

**Verify Subscription Created**:
```sql
SELECT id, userId, planType, duration, status, stripeSubscriptionId 
FROM subscriptions 
WHERE userId = (SELECT id FROM users WHERE email = 'test@example.com');
```

---

## 🔍 Debugging Tips

### Check Webhook Delivery
```bash
# View Stripe CLI logs
stripe listen --forward-to localhost:3001/api/stripe/webhook --print-secret
```

### Check API Logs
All webhook processing is logged with emojis:
- 🔄 Processing
- ✅ Success
- ⚠️ Warning
- ❌ Error

### Database Inspection
Use TablePlus or `psql`:
```bash
psql $DATABASE_URL
```

### Email Debugging
- Check Resend dashboard for delivery status
- Check `email_logs` table for status
- Test email endpoint: `POST /api/email/test`

---

## 🚀 Production Checklist

Before deploying to production:

- [ ] Database migrations applied
- [ ] Environment variables set (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY, FRONTEND_URL)
- [ ] Stripe webhook endpoint configured in Stripe Dashboard
- [ ] Webhook secret added to production `.env`
- [ ] Frontend activation page created (`/activate?token=xxx&userId=yyy`)
- [ ] Email templates reviewed and tested
- [ ] Password requirements documented for users
- [ ] Error messages are user-friendly
- [ ] Monitoring/alerting set up for failed webhooks
- [ ] Backup/restore procedures tested

---

## 📊 Monitoring & Metrics

Track these metrics:

1. **Webhook Success Rate**: Should be >99%
2. **Email Delivery Rate**: Check Resend dashboard
3. **Activation Completion Rate**: Users who activate after checkout
4. **Token Expiration**: Tokens expiring before use
5. **Failed Activations**: Reasons for failures

---

## 🐛 Common Issues & Solutions

### Issue: "Token not found"
**Solution**: Check token was created in database, verify webhook fired correctly

### Issue: "Email not received"
**Solution**: 
- Check Resend API key
- Check spam folder
- Verify email_logs table shows `SENT` status
- Check Resend dashboard for delivery details

### Issue: "Webhook signature invalid"
**Solution**: 
- Verify `STRIPE_WEBHOOK_SECRET` in `.env`
- Ensure `express.raw()` middleware is configured
- Check webhook secret matches Stripe dashboard

### Issue: "User not found"
**Solution**: Check webhook fired before user creation, verify email extraction logic

---

## 📝 Next Steps

After testing:

1. **Create Frontend Activation Page**
   - Page at `/activate`
   - Extract `token` and `userId` from URL params
   - Form for name + password
   - Call `POST /api/auth/activate`
   - Redirect to login/dashboard on success

2. **Add Resend Activation Email Endpoint**
   ```typescript
   POST /api/auth/resend-activation
   Body: { email: string }
   ```

3. **Add Password Reset Flow**
   - Similar to activation but for existing users

4. **Add Login Endpoint**
   ```typescript
   POST /api/auth/login
   Body: { email: string, password: string }
   ```

5. **Add Token Cleanup Cron Job**
   - Delete expired tokens periodically
   ```typescript
   await authService.cleanupExpiredTokens();
   ```

---

## 🎯 Success Criteria

✅ Flow is working if:
- User created after checkout
- Order created with status COMPLETED
- Activation email sent
- Token stored in database with expiration
- Activation endpoint validates token
- Password hashed and stored
- User can activate account
- Order signUpStatus updated to ACTIVATED
- Token marked as used after activation

---

**Need Help?** Check logs, database, and Resend dashboard. All steps should be logged with clear emoji indicators! 🎉
