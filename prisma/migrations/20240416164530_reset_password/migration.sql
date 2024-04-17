-- AlterTable
ALTER TABLE "users" ADD COLUMN     "mustResetPassword" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ALTER COLUMN "mustResetPassword" DROP DEFAULT;
