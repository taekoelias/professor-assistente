/*
  Warnings:

  - You are about to drop the column `valores` on the `tags` table. All the data in the column will be lost.
  - Added the required column `metadata` to the `tags` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor` to the `tags` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tags" DROP COLUMN "valores",
ADD COLUMN     "metadata" JSONB NOT NULL,
ADD COLUMN     "valor" TEXT NOT NULL;
