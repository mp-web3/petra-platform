-- CreateEnum
CREATE TYPE "SignUpStatus" AS ENUM ('PENDING', 'ACTIVATED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "EmailType" AS ENUM ('TRANSACTIONAL', 'MARKETING', 'SIGNUP', 'PASSWORD_RESET', 'WELCOME');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('SENT', 'FAILED', 'DELIVERED', 'OPENED', 'BOUNCED');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "sign_up_status" "SignUpStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "email_logs" (
    "id" TEXT NOT NULL,
    "emailType" "EmailType" NOT NULL,
    "order_id" TEXT,
    "campaign" TEXT,
    "recipient_email" TEXT NOT NULL,
    "status" "EmailStatus" NOT NULL,
    "provider_id" TEXT,
    "error_message" TEXT,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delivered_at" TIMESTAMP(3),
    "opened_at" TIMESTAMP(3),

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
