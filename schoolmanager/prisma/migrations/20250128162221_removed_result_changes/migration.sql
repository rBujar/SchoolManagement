/*
  Warnings:

  - You are about to drop the column `classId` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Result` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_classId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_teacherId_fkey";

-- AlterTable
ALTER TABLE "Result" DROP COLUMN "classId",
DROP COLUMN "teacherId",
DROP COLUMN "title";
