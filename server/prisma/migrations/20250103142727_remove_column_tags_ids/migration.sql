/*
  Warnings:

  - You are about to drop the column `tipoTag` on the `conteudo_tags` table. All the data in the column will be lost.
  - You are about to drop the column `tagsId` on the `conteudos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "conteudo_tags" DROP COLUMN "tipoTag";

-- AlterTable
ALTER TABLE "conteudos" DROP COLUMN "tagsId";
