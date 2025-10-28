/*
  Warnings:

  - You are about to drop the column `disclosure_version` on the `consents` table. All the data in the column will be lost.
  - Added the required column `disclosure_tos_version` to the `consents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "consents" DROP COLUMN "disclosure_version",
ADD COLUMN     "disclosure_privacy_version" TEXT NOT NULL DEFAULT 'v1.0',
ADD COLUMN     "disclosure_tos_version" TEXT NOT NULL,
ADD COLUMN     "privacy_accepted" BOOLEAN NOT NULL DEFAULT true;
