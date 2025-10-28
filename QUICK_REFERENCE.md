# ⚡ Quick Reference Card

## 🚀 Start Everything

```bash
# 1. Start database
docker-compose up postgres -d

# 2. Start API (in terminal 1)
pnpm --filter @petra/api dev

# 3. Start frontend (in terminal 2)
pnpm --filter @petra/web-marketing dev
```

**Access URLs:**
- Marketing: http://localhost:3000
- API: http://localhost:3001
- Prisma Studio: http://localhost:5555

---

## 💾 Data Persistence (Important!)

**✅ Your data WILL persist** when you:
- Stop Docker: `docker-compose down` 
- Restart Docker: `docker-compose restart postgres`
- Restart your computer
- Delete the container (volume is separate)

**❌ Your data will be DELETED** only if you:
- Run: `docker-compose down -v` (the `-v` flag removes volumes)
- Manually delete volume: `docker volume rm petra-platform_postgres_data`

```bash
# Check your volume exists
docker volume ls | grep postgres

# Test persistence
cd apps/api && ./test-persistence.sh

# Backup database (recommended before major changes)
docker exec petra-postgres pg_dump -U petra petra_platform > backup_$(date +%Y%m%d).sql

# Restore from backup
docker exec -i petra-postgres psql -U petra -d petra_platform < backup_20250127.sql
```

---

## 🔍 Check Database After Checkout

```bash
cd apps/api && ./check-database.sh
```

**What to look for:**
- ✅ New user in `users` table (with email + `stripe_customer_id`)
- ✅ New order in `orders` table (status = `COMPLETED`)
- ✅ New consent in `consents` table (`tos_accepted` = `true`)

---

## 🗄️ View Database Data

**Option 1 - Visual (Recommended):**
```bash
cd apps/api && pnpm prisma:studio
# Opens http://localhost:5555
```

**Option 2 - Command Line:**
```bash
cd apps/api && ./check-database.sh
```

**Option 3 - Direct SQL:**
```bash
docker exec petra-postgres psql -U petra -d petra_platform

# Example queries:
SELECT * FROM users ORDER BY created_at DESC LIMIT 5;
SELECT * FROM orders WHERE status = 'COMPLETED';
SELECT * FROM consents WHERE marketing_opt_in = true;
SELECT o.id, o.status, u.email, c.tos_accepted 
FROM orders o 
JOIN users u ON o.user_id = u.id 
LEFT JOIN consents c ON c.order_id = o.id;
```

---

## 📊 Database Schema

| Table           | Purpose              | Key Fields                                  |
| --------------- | -------------------- | ------------------------------------------- |
| `users`         | User accounts        | `email`, `stripe_customer_id`               |
| `orders`        | Payment records      | `status`, `amount`, `stripe_session_id`     |
| `consents`      | Terms acceptance     | `tos_accepted`, `marketing_opt_in`          |
| `subscriptions` | Active subscriptions | `plan_type`, `status`, `current_period_end` |
| `plan_catalog`  | Available plans      | `stripe_price_id`, `active`                 |

---

## 🛠️ Common Commands

```bash
# Check what's running on ports
lsof -i :3000,3001,3002,5432

# Restart database
docker-compose restart postgres

# View database logs
docker logs petra-postgres -f

# Stop local PostgreSQL (to avoid conflicts)
brew services stop postgresql@16

# Generate Prisma client after schema change
cd apps/api && pnpm prisma:generate

# Create new migration
cd apps/api && pnpm prisma migrate dev --name your_migration_name

# Run all tests
pnpm test

# Check types
pnpm typecheck

# Lint code
pnpm lint
```

---

## 🐛 Troubleshooting

| Issue                | Solution                                                 |
| -------------------- | -------------------------------------------------------- |
| Port 5432 busy       | `brew services stop postgresql@16`                       |
| Prisma can't connect | Check Docker is running: `docker ps`                     |
| API won't start      | Check TypeScript errors: `cd apps/api && pnpm typecheck` |
| Database empty       | Run migrations: `cd apps/api && pnpm prisma migrate dev` |

---

## 📧 Email Automation

**Supabase does NOT have built-in email automation.**

**Recommended providers:**
- **Resend** - Best for transactional emails (3,000 free/month)
- **SendGrid** - Best for marketing campaigns (100/day free)

**See full guide:** [docs/EMAIL_AUTOMATION.md](./docs/EMAIL_AUTOMATION.md)

---

## 🔐 Authentication Strategy

**✅ Recommended: Guest Checkout → Auto-Create Account**

```
User Flow:
1. Browse plans → Choose plan → Enter email → Pay (no signup!)
2. Payment success → System auto-creates account (email only)
3. User receives "Claim Your Account" email
4. User clicks link → Sets name + password → Account activated
```

**Why this approach?**
- ✅ 25-35% higher conversion (no friction before purchase)
- ✅ Only PAYING customers in database (clean data)
- ✅ Users motivated to activate (already invested)
- ✅ Modern UX (Stripe, Shopify, Notion do this)

**NOT recommended: Register before purchase ❌**
- Users abandon when forced to register (25-35% drop-off)
- Many "zombie accounts" (registered, never purchased)
- Support burden for non-customers

**See full guide:** [docs/AUTHENTICATION_STRATEGY.md](./docs/AUTHENTICATION_STRATEGY.md)  
**See comparison:** [docs/USER_JOURNEY_COMPARISON.md](./docs/USER_JOURNEY_COMPARISON.md)

---

## 🎯 Typical Development Session

```bash
# Morning
docker-compose up postgres -d
pnpm --filter @petra/api dev &
pnpm --filter @petra/web-marketing dev

# During work
# Make changes, test in browser at localhost:3000

# Check database after testing checkout
cd apps/api && ./check-database.sh

# Or open Prisma Studio
cd apps/api && pnpm prisma:studio

# Evening
# Ctrl+C to stop servers
docker-compose down  # Optional - can leave running
```

---

## 📱 Test Stripe Checkout

1. Visit: http://localhost:3000/coaching-donna-online
2. Click a plan → "scegli"
3. Fill in preview page (email, accept terms)
4. Click "Procedi al Pagamento"
5. Use test card: `4242 4242 4242 4242`
6. Check database: `cd apps/api && ./check-database.sh`

---

## 🔗 Useful Links

- **Prisma Studio**: http://localhost:5555
- **Stripe Dashboard**: https://dashboard.stripe.com/test/payments
- **Stripe Test Cards**: https://stripe.com/docs/testing#cards
- **Resend**: https://resend.com
- **SendGrid**: https://sendgrid.com

---

**Need help?** Check the main [README.md](./README.md) or [docs/](./docs/) folder.

