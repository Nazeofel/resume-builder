/*
  Warnings:

  - You are about to drop the column `manaCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `sessionToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'TRIAL');

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "manaCount",
DROP COLUMN "sessionToken",
ADD COLUMN     "billingPeriodEnd" TIMESTAMP(3),
ADD COLUMN     "billingPeriodStart" TIMESTAMP(3),
ADD COLUMN     "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'INACTIVE',
ADD COLUMN     "usageCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usageLimit" INTEGER NOT NULL DEFAULT 100;

-- Rename Transaction table to ArchivedTransaction
ALTER TABLE "Transaction" RENAME TO "ArchivedTransaction";

-- Rename primary key constraint
ALTER TABLE "ArchivedTransaction" RENAME CONSTRAINT "Transaction_pkey" TO "ArchivedTransaction_pkey";

-- Rename unique index
ALTER INDEX "Transaction_stripeSessionId_key" RENAME TO "ArchivedTransaction_stripeSessionId_key";

-- Rename indexes
ALTER INDEX "Transaction_userId_idx" RENAME TO "ArchivedTransaction_userId_idx";
ALTER INDEX "Transaction_stripeSessionId_idx" RENAME TO "ArchivedTransaction_stripeSessionId_idx";

-- AddForeignKey
ALTER TABLE "ArchivedTransaction" ADD CONSTRAINT "ArchivedTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
