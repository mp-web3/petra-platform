/**
 * Clean Database Script
 * 
 * WARNING: This script will DELETE ALL DATA from the database!
 * Only use in development/testing environments.
 * 
 * Usage:
 *   pnpm ts-node scripts/clean-database.ts
 * 
 * Or with tsx:
 *   pnpm tsx scripts/clean-database.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
    console.log('🧹 Starting database cleanup...');
    console.log('⚠️  WARNING: This will delete ALL data from the database!');

    try {
        // Delete in order to respect foreign key constraints
        // 1. Delete EmailLogs (references Order, but orderId is nullable)
        console.log('📧 Deleting email logs...');
        const emailLogsCount = await prisma.emailLog.deleteMany({});
        console.log(`   ✅ Deleted ${emailLogsCount.count} email log(s)`);

        // 2. Delete ActivationTokens (has cascade delete, but safer to delete explicitly)
        console.log('🔑 Deleting activation tokens...');
        const tokensCount = await prisma.activationToken.deleteMany({});
        console.log(`   ✅ Deleted ${tokensCount.count} activation token(s)`);

        // 3. Delete Consents (references Order)
        console.log('📋 Deleting consents...');
        const consentsCount = await prisma.consent.deleteMany({});
        console.log(`   ✅ Deleted ${consentsCount.count} consent(s)`);

        // 4. Delete Orders (references User, but userId is nullable)
        console.log('📦 Deleting orders...');
        const ordersCount = await prisma.order.deleteMany({});
        console.log(`   ✅ Deleted ${ordersCount.count} order(s)`);

        // 5. Delete Subscriptions (references User)
        console.log('💳 Deleting subscriptions...');
        const subscriptionsCount = await prisma.subscription.deleteMany({});
        console.log(`   ✅ Deleted ${subscriptionsCount.count} subscription(s)`);

        // 6. Delete Users (no dependencies after cleaning above)
        console.log('👤 Deleting users...');
        const usersCount = await prisma.user.deleteMany({});
        console.log(`   ✅ Deleted ${usersCount.count} user(s)`);

        // 7. Delete PlanCatalog (no dependencies)
        console.log('📚 Deleting plan catalog entries...');
        const plansCount = await prisma.planCatalog.deleteMany({});
        console.log(`   ✅ Deleted ${plansCount.count} plan catalog entry/entries`);

        console.log('\n✅ Database cleanup completed successfully!');
        console.log('📊 Summary:');
        console.log(`   - Email Logs: ${emailLogsCount.count}`);
        console.log(`   - Activation Tokens: ${tokensCount.count}`);
        console.log(`   - Consents: ${consentsCount.count}`);
        console.log(`   - Orders: ${ordersCount.count}`);
        console.log(`   - Subscriptions: ${subscriptionsCount.count}`);
        console.log(`   - Users: ${usersCount.count}`);
        console.log(`   - Plan Catalog: ${plansCount.count}`);
    } catch (error: any) {
        console.error('❌ Error during database cleanup:', error.message);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the cleanup
cleanDatabase()
    .then(() => {
        console.log('\n✨ Done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Cleanup failed:', error);
        process.exit(1);
    });

