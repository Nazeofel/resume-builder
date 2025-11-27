/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Resume` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Resume" DROP CONSTRAINT "Resume_ownerId_fkey";

-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "ownerId",
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
