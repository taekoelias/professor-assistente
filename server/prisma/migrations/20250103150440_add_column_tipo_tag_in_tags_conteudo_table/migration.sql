/*
  Warnings:

  - Added the required column `tipoTag` to the `conteudo_tags` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "conteudo_tags" ADD COLUMN     "tipoTag" TEXT NOT NULL;
