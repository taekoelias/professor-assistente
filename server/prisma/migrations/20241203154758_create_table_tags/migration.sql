-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "valores" JSONB NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tags_tipo_key" ON "tags"("tipo");
