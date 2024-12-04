/*
  Warnings:

  - Changed the type of `valores` on the `tags` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "tags" ADD COLUMN     "excluido" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "valores",
ADD COLUMN     "valores" JSONB NOT NULL;
