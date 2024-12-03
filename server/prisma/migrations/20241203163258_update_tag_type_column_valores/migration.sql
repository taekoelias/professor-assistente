/*
  Warnings:

  - The `valores` column on the `tags` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "tags" DROP COLUMN "valores",
ADD COLUMN     "valores" JSONB[];
