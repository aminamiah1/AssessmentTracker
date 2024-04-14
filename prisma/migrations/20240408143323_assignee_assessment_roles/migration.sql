-- DropForeignKey
ALTER TABLE "_AssessmentsToUsers" DROP CONSTRAINT "_AssessmentsToUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_AssessmentsToUsers" DROP CONSTRAINT "_AssessmentsToUsers_B_fkey";

-- DropTable
DROP TABLE "_AssessmentsToUsers";

-- CreateTable
CREATE TABLE "AssigneeRole" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role" "Role" NOT NULL,
    "assessment_id" INTEGER NOT NULL,
    "priority" INTEGER,
    CONSTRAINT "AssigneeRole_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AssigneeRole" ADD CONSTRAINT "AssigneeRole_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssigneeRole" ADD CONSTRAINT "AssigneeRole_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "AssigneeRole_user_id_assessment_id_key" ON "AssigneeRole"("user_id", "assessment_id");