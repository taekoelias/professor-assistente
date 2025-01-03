-- CreateTable
CREATE TABLE "Conteudos" (
    "id" TEXT NOT NULL,
    "excluido" BOOLEAN NOT NULL DEFAULT false,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAlteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conteudos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItensConteudo" (
    "id" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "conteudoId" TEXT NOT NULL,
    "descricao" TEXT,
    "metadados" JSONB,
    "excluido" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ItensConteudo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ConteudosToTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ConteudosToTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ConteudosToTags_B_index" ON "_ConteudosToTags"("B");

-- AddForeignKey
ALTER TABLE "ItensConteudo" ADD CONSTRAINT "ItensConteudo_conteudoId_fkey" FOREIGN KEY ("conteudoId") REFERENCES "Conteudos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConteudosToTags" ADD CONSTRAINT "_ConteudosToTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Conteudos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConteudosToTags" ADD CONSTRAINT "_ConteudosToTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
