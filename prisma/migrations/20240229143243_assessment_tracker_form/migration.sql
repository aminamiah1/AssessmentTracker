/*
  Warnings:

  - The values [integer,date_time] on the enum `Data_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `data_type` on the `Response` table. All the data in the column will be lost.
  - Added the required column `response_type` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Data_type_new" AS ENUM ('boolean', 'string');
ALTER TABLE "Response" ALTER COLUMN "data_type" TYPE "Data_type_new" USING ("data_type"::text::"Data_type_new");
ALTER TYPE "Data_type" RENAME TO "Data_type_old";
ALTER TYPE "Data_type_new" RENAME TO "Data_type";
DROP TYPE "Data_type_old";
COMMIT;

-- AlterTable
ALTER TABLE "Response" ADD COLUMN     "date_completed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "response_type" "Data_type" NOT NULL;

-- AlterTable
ALTER TABLE "Response" DROP COLUMN "data_type";


-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "choices" TEXT[];


-- AlterTable
ALTER TABLE "Part" ADD COLUMN     "role" "Role" NOT NULL;




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


/*
  Warnings:

  - Made the column `status` on table `Module` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Module" ALTER COLUMN "status" SET NOT NULL;

-- AlterTable
ALTER TABLE "Part" ADD COLUMN     "next_part_id" INTEGER;


-- AddForeignKey
ALTER TABLE "Part" ADD CONSTRAINT "Part_next_part_id_fkey" FOREIGN KEY ("next_part_id") REFERENCES "Part"("id") ON DELETE SET NULL ON UPDATE CASCADE;
