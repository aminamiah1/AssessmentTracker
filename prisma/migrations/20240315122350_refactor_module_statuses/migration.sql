/*
  Warnings:

  - The values [inactive,expired] on the enum `ModuleStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ModuleStatus_new" AS ENUM ('active', 'archived', 'completed');
ALTER TABLE "Module" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Module" ALTER COLUMN "status" TYPE "ModuleStatus_new" USING ("status"::text::"ModuleStatus_new");
ALTER TYPE "ModuleStatus" RENAME TO "ModuleStatus_old";
ALTER TYPE "ModuleStatus_new" RENAME TO "ModuleStatus";
DROP TYPE "ModuleStatus_old";
ALTER TABLE "Module" ALTER COLUMN "status" SET DEFAULT 'active';
COMMIT;
