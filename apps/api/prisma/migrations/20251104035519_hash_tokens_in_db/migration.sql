/*
  Warnings:

  - You are about to drop the column `token` on the `activation_tokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token_hash]` on the table `activation_tokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token_hash` to the `activation_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."activation_tokens_token_idx";

-- DropIndex
DROP INDEX "public"."activation_tokens_token_key";

-- AlterTable
ALTER TABLE "activation_tokens" DROP COLUMN "token",
ADD COLUMN     "token_hash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "activation_tokens_token_hash_key" ON "activation_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "activation_tokens_token_hash_idx" ON "activation_tokens"("token_hash");
