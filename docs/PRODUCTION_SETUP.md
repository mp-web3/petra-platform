# 🚀 Production Setup Guide

This guide covers all steps needed to prepare the activation flow for production.

## 📦 Step 1: Database Migration

Run the migration to add the new tables and fields:

```bash
cd apps/api
npx prisma migrate dev --name add_activation_system
```

This will:
- Add `password` field to `users` table
- Create `activation_tokens` table
- Add indexes for performance

**Verify migration**:
```bash
npx prisma studio
# Check users table has password column
# Check activation_tokens table exists
```

---

## 📦 Step 2: Install Dependencies

Ensure all required packages are installed:

```bash
# From project root
pnpm install

# Verify bcrypt is installed
pnpm list bcrypt
```

**Required packages**:
- `bcrypt` (password hashing)
- `@types/bcrypt` (TypeScript types)
- `@prisma/client` (database client)

---

## 📦 Step 3: Environment Variables

Update `.env` in `apps/api/`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/petra_db?schema=public"

# Stripe (Production)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # Get from Stripe Dashboard > Webhooks

# Email (Resend)
RESEND_API_KEY="re_..."

# Frontend URL (Production)
FRONTEND_URL="https://yourdomain.com"

# Optional: Token expiration (defaults to 7 days)
ACTIVATION_TOKEN_EXPIRATION_DAYS=7
```

**How to get Stripe Webhook Secret**:
1. Go to Stripe Dashboard > Developers > Webhooks
2. Create or select your endpoint: `https://api.yourdomain.com/api/stripe/webhook`
3. Copy the "Signing secret" (starts with `whsec_`)
4. Add to `.env` as `STRIPE_WEBHOOK_SECRET`

---

## 📦 Step 4: Generate Prisma Client

After migration, regenerate Prisma client:

```bash
cd apps/api
npx prisma generate
```

This ensures TypeScript types include:
- `ActivationToken` model
- `password` field on `User` model

**Restart TypeScript server** in your IDE if types still show errors.

---

## 📦 Step 5: Configure Stripe Webhook

### In Stripe Dashboard:

1. **Create Webhook Endpoint**:
   - URL: `https://api.yourdomain.com/api/stripe/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `payment_intent.succeeded` (optional)

2. **Copy Webhook Secret**:
   - Click on the webhook endpoint
   - Copy "Signing secret"
   - Add to `.env`: `STRIPE_WEBHOOK_SECRET=whsec_...`

3. **Test Webhook**:
   - Send test event from Stripe Dashboard
   - Verify it reaches your API
   - Check API logs for processing

---

## 📦 Step 6: Verify Email Configuration

### Resend Setup:

1. **Verify Domain** (recommended):
   - Go to Resend Dashboard > Domains
   - Add and verify `coachingpetra.com`
   - Update `from` address in `email.service.ts`

2. **Test Email Sending**:
   ```bash
   curl -X POST http://localhost:3001/api/email/test \
     -H "Content-Type: application/json" \
     -d '{"name": "Test"}'
   ```

3. **Check Email Logs**:
   ```sql
   SELECT * FROM email_logs ORDER BY sentAt DESC LIMIT 10;
   ```

---

## 📦 Step 7: Frontend Integration

Create the activation page in your frontend:

### Example: Next.js Page

```typescript
// apps/web-marketing/src/app/activate/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ActivatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const userId = searchParams.get('userId');

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleActivate = async () => {
    if (!token || !userId) {
      setError('Invalid activation link');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, userId, name, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Activation failed');
      }

      // Success - redirect to login
      router.push('/login?activated=true');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ... render form
}
```

---

## 📦 Step 8: Security Checklist

- [ ] **HTTPS Only**: All API endpoints use HTTPS
- [ ] **Webhook Signature Verification**: Verified in `stripe.controller.ts`
- [ ] **Password Hashing**: Using bcrypt with 10 salt rounds
- [ ] **Token Expiration**: Tokens expire after 7 days
- [ ] **Token Single Use**: Tokens marked as used after activation
- [ ] **Input Validation**: DTOs validate all inputs
- [ ] **SQL Injection Protection**: Using Prisma (parameterized queries)
- [ ] **Rate Limiting**: Consider adding rate limits to activation endpoint
- [ ] **CORS Configuration**: Only allow frontend domain
- [ ] **Environment Variables**: Never commit `.env` files

---

## 📦 Step 9: Monitoring & Logging

### Set up monitoring for:

1. **Webhook Failures**:
   - Monitor for non-200 responses
   - Alert on signature verification failures
   - Track webhook retry attempts

2. **Email Failures**:
   - Monitor `email_logs` table for `FAILED` status
   - Alert on high failure rates
   - Track Resend API errors

3. **Activation Issues**:
   - Monitor activation endpoint errors
   - Track token expiration vs usage
   - Alert on high failure rates

4. **Database Health**:
   - Monitor database connections
   - Track slow queries
   - Alert on connection pool exhaustion

---

## 📦 Step 10: Testing Before Production

### Smoke Tests:

1. **Test Checkout Flow**:
   ```bash
   # Use Stripe test mode
   # Complete a test checkout
   # Verify user, order, emails created
   ```

2. **Test Activation**:
   ```bash
   # Extract token from database
   # Call activation endpoint
   # Verify account activated
   ```

3. **Test Error Handling**:
   - Invalid token
   - Expired token
   - Already used token
   - Weak password

4. **Test Webhook Resilience**:
   - Send duplicate webhooks (should be idempotent)
   - Test with missing data
   - Test with invalid signatures

---

## 📦 Step 11: Deployment Checklist

Before deploying:

- [ ] Database migrations applied to production DB
- [ ] Environment variables set in production
- [ ] Stripe webhook endpoint configured
- [ ] Frontend activation page deployed
- [ ] Email templates reviewed
- [ ] Error messages are user-friendly
- [ ] Monitoring alerts configured
- [ ] Backup/restore procedures tested
- [ ] Rollback plan documented

---

## 📦 Step 12: Post-Deployment Verification

After deployment:

1. **Test Production Webhook**:
   - Make a test purchase
   - Verify webhook fires
   - Check API logs

2. **Verify Email Delivery**:
   - Check Resend dashboard
   - Verify emails arrive
   - Check email content

3. **Test Activation**:
   - Use production activation link
   - Complete activation
   - Verify account created

4. **Monitor for 24 Hours**:
   - Check error rates
   - Monitor webhook success rate
   - Track email delivery rate

---

## 🐛 Troubleshooting

### Issue: Prisma Client Types Not Updated

```bash
# Regenerate Prisma client
cd apps/api
npx prisma generate

# Restart TypeScript server in IDE
# VS Code: Cmd+Shift+P > "TypeScript: Restart TS Server"
```

### Issue: Migration Fails

```bash
# Check current migration status
npx prisma migrate status

# If needed, reset (WARNING: loses data)
npx prisma migrate reset

# Then run migration again
npx prisma migrate dev
```

### Issue: Webhook Not Received

1. Check Stripe Dashboard > Webhooks > Recent deliveries
2. Verify endpoint URL is correct
3. Check API logs for incoming requests
4. Verify `express.raw()` middleware is configured
5. Check webhook secret matches

### Issue: Activation Token Not Found

1. Verify token exists in database:
   ```sql
   SELECT * FROM activation_tokens WHERE token = '...';
   ```
2. Check token hasn't expired
3. Verify token hasn't been used
4. Check userId matches

---

## 📚 Additional Resources

- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Resend Documentation](https://resend.com/docs)
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)

---

**Ready for Production!** 🎉

Follow all steps, test thoroughly, and monitor closely after deployment.
