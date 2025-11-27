-- DropForeignKey
ALTER TABLE "Certification" DROP CONSTRAINT "Certification_resumeId_fkey";

-- DropForeignKey
ALTER TABLE "Language" DROP CONSTRAINT "Language_resumeId_fkey";

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Language" ADD CONSTRAINT "Language_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
