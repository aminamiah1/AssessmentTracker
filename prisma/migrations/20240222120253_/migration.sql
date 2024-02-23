-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ps_team', 'module_leader', 'internal_moderator', 'panel_member', 'external_examiner', 'system_admin');

-- CreateEnum
CREATE TYPE "Data_type" AS ENUM ('boolean', 'string', 'integer', 'date_time');

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roles" "Role"[],
    "image" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verificationtokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Module" (
    "id" SERIAL NOT NULL,
    "module_name" TEXT NOT NULL,
    "module_code" TEXT NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" SERIAL NOT NULL,
    "assessment_name" TEXT NOT NULL,
    "assessment_type" TEXT NOT NULL,
    "hand_out_week" TIMESTAMP(3) NOT NULL,
    "hand_in_week" TIMESTAMP(3) NOT NULL,
    "module_id" INTEGER NOT NULL,
    "setter_id" INTEGER,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Part" (
    "id" SERIAL NOT NULL,
    "part_title" TEXT NOT NULL,
    "part_number" INTEGER NOT NULL,

    CONSTRAINT "Part_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "question_title" TEXT NOT NULL,
    "part_id" INTEGER NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "data_type" "Data_type" NOT NULL,
    "assessment_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ModulesToUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AssessmentToPart" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AssessmentsToUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_token_key" ON "verificationtokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_identifier_token_key" ON "verificationtokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Module_module_code_key" ON "Module"("module_code");

-- CreateIndex
CREATE UNIQUE INDEX "_ModulesToUsers_AB_unique" ON "_ModulesToUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_ModulesToUsers_B_index" ON "_ModulesToUsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AssessmentToPart_AB_unique" ON "_AssessmentToPart"("A", "B");

-- CreateIndex
CREATE INDEX "_AssessmentToPart_B_index" ON "_AssessmentToPart"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AssessmentsToUsers_AB_unique" ON "_AssessmentsToUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_AssessmentsToUsers_B_index" ON "_AssessmentsToUsers"("B");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_setter_id_fkey" FOREIGN KEY ("setter_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_part_id_fkey" FOREIGN KEY ("part_id") REFERENCES "Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModulesToUsers" ADD CONSTRAINT "_ModulesToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModulesToUsers" ADD CONSTRAINT "_ModulesToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssessmentToPart" ADD CONSTRAINT "_AssessmentToPart_A_fkey" FOREIGN KEY ("A") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssessmentToPart" ADD CONSTRAINT "_AssessmentToPart_B_fkey" FOREIGN KEY ("B") REFERENCES "Part"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssessmentsToUsers" ADD CONSTRAINT "_AssessmentsToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssessmentsToUsers" ADD CONSTRAINT "_AssessmentsToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
