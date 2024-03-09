/*
  Warnings:

  - A unique constraint covering the columns `[assessment_name,module_id,hand_out_week,hand_in_week]` on the table `Assessment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Assessment_assessment_name_module_id_hand_out_week_hand_in__key" ON "Assessment"("assessment_name", "module_id", "hand_out_week", "hand_in_week");
