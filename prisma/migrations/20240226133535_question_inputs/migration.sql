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

