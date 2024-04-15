/*
  Warnings:

  - A unique constraint covering the columns `[proforma_link]` on the table `Assessment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN     "proforma_link" TEXT,
ALTER COLUMN "assessment_type" SET DEFAULT 'Portfolio';

-- CreateIndex
CREATE UNIQUE INDEX "Assessment_proforma_link_key" ON "Assessment"("proforma_link");
