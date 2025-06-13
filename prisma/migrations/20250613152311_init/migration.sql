/*
  Warnings:

  - You are about to drop the column `google_id` on the `Users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Users_google_id_key";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "google_id";
