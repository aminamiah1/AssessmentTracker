/*
  Warnings:
 
  - Added the required column `status` to the `Module` table without a default value. This is not possible if the table is not empty.
 
*/
 
-- CreateEnum
CREATE TYPE "ModuleStatus" AS ENUM ('active', 'inactive', 'expired');
 
-- AlterTable
ALTER TABLE "Module" ADD COLUMN "status" "ModuleStatus";
 
-- UpdateRecords
UPDATE "Module" SET "status" = 'active';
 
-- AlterTable
ALTER TABLE "Module" ALTER COLUMN "status" SET DEFAULT 'active';
 
-- AlterTable
ALTER TABLE "Module" ALTER COLUMN "status" SET NOT NULL;
