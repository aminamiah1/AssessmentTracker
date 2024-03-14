-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'inactive');
 
-- AlterTable
ALTER TABLE "users" ADD COLUMN "status" "UserStatus";
 
-- UpdateRecords
UPDATE "users" SET "status" = 'active';
 
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'active';
 
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "status" SET NOT NULL;
