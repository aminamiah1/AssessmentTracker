/*
  Warnings:
*/
-- CreateEnum
CREATE TYPE "Assessment_type" AS ENUM ('Written_Assessment', 'Practical_Based_Assessment', 'Class_Test', 'Portfolio', 'Exam_Online');

-- AlterTable (with default)
ALTER TABLE "Assessment"  
    ALTER COLUMN assessment_type TYPE "Assessment_type" 
    SET DEFAULT 'Portfolio'; 
