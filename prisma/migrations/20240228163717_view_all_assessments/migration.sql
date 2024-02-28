/*
  Warnings:

  - Changed the type of `assessment_type` on the `Assessment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Assessment_type" AS ENUM ('Written_Assessment', 'Practical_Based_Assessment', 'Class_Test', 'Portfolio', 'Exam_Online');

-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "assessment_type",
ADD COLUMN     "assessment_type" "Assessment_type" NOT NULL;
