/*
  Warnings:

  - You are about to drop the `Conteudos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItensConteudo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ConteudosToTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ItensConteudo" DROP CONSTRAINT "ItensConteudo_conteudoId_fkey";

-- DropForeignKey
ALTER TABLE "_ConteudosToTags" DROP CONSTRAINT "_ConteudosToTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_ConteudosToTags" DROP CONSTRAINT "_ConteudosToTags_B_fkey";

-- DropTable
DROP TABLE "Conteudos";

-- DropTable
DROP TABLE "ItensConteudo";

-- DropTable
DROP TABLE "_ConteudosToTags";

-- CreateTable
CREATE TABLE "conteudos" (
    "id" TEXT NOT NULL,
    "excluido" BOOLEAN NOT NULL DEFAULT false,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAlteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tagsId" TEXT[],

    CONSTRAINT "conteudos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conteudo_itens" (
    "id" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "conteudoId" TEXT NOT NULL,
    "descricao" TEXT,
    "metadados" JSONB,
    "excluido" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "conteudo_itens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conteudo_tags" (
    "tagsId" TEXT NOT NULL,
    "conteudoId" TEXT NOT NULL,
    "tipoTag" TEXT NOT NULL,

    CONSTRAINT "conteudo_tags_pkey" PRIMARY KEY ("tagsId","conteudoId")
);

-- CreateIndex
CREATE INDEX "conteudo_tags_tagsId_idx" ON "conteudo_tags"("tagsId");

-- AddForeignKey
ALTER TABLE "conteudo_itens" ADD CONSTRAINT "conteudo_itens_conteudoId_fkey" FOREIGN KEY ("conteudoId") REFERENCES "conteudos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conteudo_tags" ADD CONSTRAINT "conteudo_tags_tagsId_fkey" FOREIGN KEY ("tagsId") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conteudo_tags" ADD CONSTRAINT "conteudo_tags_conteudoId_fkey" FOREIGN KEY ("conteudoId") REFERENCES "conteudos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
