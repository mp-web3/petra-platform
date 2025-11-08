# 🔗 Connecting Prisma to Supabase - Complete Guide

This guide explains how to correctly connect Prisma to Supabase PostgreSQL for the Petra Platform.

**Reference**: [Supabase Prisma Documentation](https://supabase.com/docs/guides/database/prisma)

---

## 📋 Prerequisites

- Supabase project created and active
- Prisma installed in your project
- Access to Supabase SQL Editor

---

## Step 1: Create Prisma User in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run this SQL to create a dedicated `prisma` user:

```sql
-- Create custom user
CREATE USER "prisma" WITH PASSWORD 'your_secure_password_here' BYPASSRLS CREATEDB;

-- Extend prisma's privileges to postgres (necessary to view changes in Dashboard)
GRANT "prisma" TO "postgres";

-- Grant it necessary permissions over the relevant schemas (public)
GRANT USAGE ON SCHEMA public TO prisma;
GRANT CREATE ON SCHEMA public TO prisma;
GRANT ALL ON ALL TABLES IN SCHEMA public TO prisma;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO prisma;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO prisma;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO prisma;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO prisma;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO prisma;
```

**Important**: 
- Replace `'your_secure_password_here'` with a strong password
- **Save this password** - you'll need it for the connection string
- Use a password manager to generate a secure password

### To Change Password Later

```sql
ALTER USER "prisma" WITH PASSWORD 'new_password';
```

---

## Step 2: Get Connection String from Supabase

1. Go to your Supabase Dashboard
2. Click **"Connect"** button (or go to **Settings → Database**)
3. Scroll to **"Connection string"** section
4. Select the **"Server-based deployments"** tab (NOT "Serverless")
5. Find the **Supavisor Session pooler string** - it should end with `:5432/postgres`
6. Copy this connection string

**Example format:**
```
postgres://[DB-USER].[PROJECT-REF]:[PASSWORD]@[DB-REGION].pooler.supabase.com:5432/postgres
```

---

## Step 3: Configure Your .env File

In `apps/api/.env`, set your `DATABASE_URL`:

### For Server-Based Deployments (Recommended)

**Use Direct Connection** (most reliable with Prisma):

```env
# Direct connection with SSL (Recommended for Production)
DATABASE_URL="postgresql://prisma:[PRISMA-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require"
```

**Replace:**
- `[PROJECT-REF]` with your Supabase project reference (e.g., `iglnqcndfzktzaqdtumv`)
- `[PRISMA-PASSWORD]` with the password you set for the `prisma` user in Step 1

**Example:**
```env
# Production (with SSL - recommended)
DATABASE_URL="postgresql://prisma:your_prisma_password@db.iglnqcndfzktzaqdtumv.supabase.co:5432/postgres?sslmode=require"

# Development (without SSL - only if you have connection issues)
DATABASE_URL="postgresql://prisma:your_prisma_password@db.iglnqcndfzktzaqdtumv.supabase.co:5432/postgres"
```

**SSL Configuration:**
- ✅ **Always use `?sslmode=require` in production** - encrypts data in transit
- ✅ Protects sensitive user data, payment information, and credentials
- ✅ Required for GDPR and PCI-DSS compliance
- 🟡 Can optionally skip in local development if needed

### Alternative: Connection Pooler (if direct connection doesn't work)

```env
# Pooler connection (may have protocol compatibility issues)
DATABASE_URL="postgresql://prisma.[PROJECT-REF]:[PRISMA-PASSWORD]@[DB-REGION].pooler.supabase.com:5432/postgres"
```

### Important Notes

- ✅ **Direct connection is recommended** - most reliable with Prisma
- ✅ Direct connection username: `prisma` (just the username, no project ref)
- ✅ Pooler username format: `prisma.[PROJECT-REF]` (e.g., `prisma.iglnqcndfzktzaqdtumv`)
- ✅ Use **port 5432** for migrations and server-based deployments
- ❌ **Don't use port 6543** - that's for serverless/transaction mode and doesn't support migrations
- ❌ **Don't use `postgres` user** - use the dedicated `prisma` user

---

## Step 4: Test the Connection

```bash
cd apps/api
pnpm prisma db pull
```

If successful, you should see:
```
✔ Introspecting based on datasource defined in prisma/schema.prisma
✔ Introspected X models...
```

---

## Step 5: Run Migrations

Once connected, you can run Prisma migrations:

```bash
# Create a new migration
pnpm prisma migrate dev --name migration_name

# Apply migrations in production
pnpm prisma migrate deploy
```

---

## 🔍 Troubleshooting

### Error: "Authentication failed"

**Solution:**
- Verify the `prisma` user exists in Supabase (check Database Roles)
- Ensure you're using the correct password for the `prisma` user (not the `postgres` password)
- Check that the username format is correct: `prisma.[PROJECT-REF]`

### Error: "Can't reach database server"

**Solution:**
- Check if your Supabase project is paused (free tier pauses after inactivity)
- Verify network restrictions: **Settings → Database → Network Restrictions** should allow all IPs
- Ensure you're using port **5432** (not 6543)
- Try the direct connection if pooler doesn't work (see below)

### Error: "unexpected message from server"

**Solution:**
- This error occurs when using the connection pooler with Prisma
- **Switch to direct connection** instead of pooler:
  ```env
  # Use direct connection instead of pooler
  DATABASE_URL="postgresql://prisma:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
  ```
- Note: Direct connection uses `prisma` as username (not `prisma.[PROJECT-REF]`)
- The pooler (even on port 5432) sometimes has protocol compatibility issues with Prisma

### Connection String Format Issues

**Wrong:**
```env
# ❌ Port 6543 (serverless, doesn't support migrations)
DATABASE_URL="postgres://...@pooler.supabase.com:6543/postgres?pgbouncer=true"

# ❌ Using postgres user instead of prisma
DATABASE_URL="postgres://postgres.[PROJECT-REF]:[PASSWORD]@..."
```

**Correct:**
```env
# ✅ Port 5432 (session mode, supports migrations)
DATABASE_URL="postgres://prisma.[PROJECT-REF]:[PRISMA-PASSWORD]@pooler.supabase.com:5432/postgres"
```

---

## 🔄 Alternative: Direct Connection (If Pooler Doesn't Work)

If the pooler connection doesn't work, you can use a direct connection:

1. In **Settings → Database → Connection string**
2. Look for **"Direct connection"** (not pooler)
3. Use this format:

```env
DATABASE_URL="postgresql://prisma:[PRISMA-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?schema=public"
```

**Note**: Direct connection uses `prisma` (not `prisma.[PROJECT-REF]`) as the username.

---

## 📝 Quick Reference

### Connection String Components

| Component | Value                          | Example                               |
| --------- | ------------------------------ | ------------------------------------- |
| Protocol  | `postgres://`                  | `postgres://`                         |
| Username  | `prisma.[PROJECT-REF]`         | `prisma.iglnqcndfzktzaqdtumv`         |
| Password  | Your prisma user password      | `your_secure_password`                |
| Host      | `[REGION].pooler.supabase.com` | `aws-1-eu-west-1.pooler.supabase.com` |
| Port      | `5432` (Session mode)          | `5432`                                |
| Database  | `postgres`                     | `postgres`                            |

### Port Comparison

| Port | Mode        | Use Case                 | Supports Migrations |
| ---- | ----------- | ------------------------ | ------------------- |
| 5432 | Session     | Server-based deployments | ✅ Yes               |
| 6543 | Transaction | Serverless/auto-scaling  | ❌ No                |

---

## ✅ Checklist

Before testing your connection, verify:

- [ ] `prisma` user created in Supabase SQL Editor
- [ ] `prisma` user password saved securely
- [ ] Connection string uses port **5432** (not 6543)
- [ ] Username format: `prisma.[PROJECT-REF]`
- [ ] Using `postgres://` protocol
- [ ] Supabase project is active (not paused)
- [ ] Network restrictions allow your IP (or all IPs)

---

## 🔗 Resources

- [Supabase Prisma Documentation](https://supabase.com/docs/guides/database/prisma)
- [Prisma Connection Management](https://www.prisma.io/docs/concepts/components/prisma-client/connection-management)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)

---

**Last Updated**: January 2025

