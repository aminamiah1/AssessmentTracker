/*
  Warnings:

  - The primary key for the `Response` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the `_AssessmentToPart` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AssessmentToPart" DROP CONSTRAINT "_AssessmentToPart_A_fkey";

-- DropForeignKey
ALTER TABLE "_AssessmentToPart" DROP CONSTRAINT "_AssessmentToPart_B_fkey";

-- AlterTable
ALTER TABLE "Response" DROP CONSTRAINT "Response_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Response_pkey" PRIMARY KEY ("assessment_id", "question_id");

-- DropTable
DROP TABLE "_AssessmentToPart";

-- CreateTable
CREATE TABLE "PartSubmission" (
    "date_submitted" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "part_id" INTEGER NOT NULL,
    "assessment_id" INTEGER NOT NULL,

    CONSTRAINT "PartSubmission_pkey" PRIMARY KEY ("part_id","assessment_id")
);

-- AddForeignKey
ALTER TABLE "PartSubmission" ADD CONSTRAINT "PartSubmission_part_id_fkey" FOREIGN KEY ("part_id") REFERENCES "Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartSubmission" ADD CONSTRAINT "PartSubmission_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
