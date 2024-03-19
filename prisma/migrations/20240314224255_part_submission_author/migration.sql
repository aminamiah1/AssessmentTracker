/*
  Warnings:

  - Added the required column `submitted_by` to the `PartSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assessment" ALTER COLUMN "assessment_type" DROP DEFAULT;

-- AlterTable
ALTER TABLE "PartSubmission" ADD COLUMN     "submitted_by" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "PartSubmission" ADD CONSTRAINT "PartSubmission_submitted_by_fkey" FOREIGN KEY ("submitted_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
