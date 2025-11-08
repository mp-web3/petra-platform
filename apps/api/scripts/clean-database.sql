-- Clean Database SQL Script
-- 
-- WARNING: This script will DELETE ALL DATA from the database!
-- Only use in development/testing environments.
-- 
-- Usage:
--   psql $DATABASE_URL -f scripts/clean-database.sql
-- 
-- Or with Prisma:
--   npx prisma db execute --file scripts/clean-database.sql

-- Disable foreign key checks temporarily (PostgreSQL doesn't need this, but included for clarity)
-- PostgreSQL will enforce constraints automatically

-- Delete in order to respect foreign key constraints
-- 1. EmailLogs (references Order, but order_id is nullable)
DELETE FROM "email_logs";

-- 2. ActivationTokens (references User with cascade, but safer to delete explicitly)
DELETE FROM "activation_tokens";

-- 3. Consents (references Order)
DELETE FROM "consents";

-- 4. Orders (references User, but user_id is nullable)
DELETE FROM "orders";

-- 5. Subscriptions (references User)
DELETE FROM "subscriptions";

-- 6. Users (no dependencies after cleaning above)
DELETE FROM "users";

-- 7. PlanCatalog (no dependencies)
DELETE FROM "plan_catalog";

-- Note: Enums are not deleted as they are part of the schema
-- To reset sequences (if using auto-increment, which you're not), you would use:
-- ALTER SEQUENCE table_name_id_seq RESTART WITH 1;

SELECT 'Database cleaned successfully!' AS message;

