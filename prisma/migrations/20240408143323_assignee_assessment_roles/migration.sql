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
