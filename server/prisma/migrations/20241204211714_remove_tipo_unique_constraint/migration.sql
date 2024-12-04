-- DropIndex
DROP INDEX "tags_tipo_key";

-- CreateIndex
CREATE INDEX "tags_tipo_idx" ON "tags"("tipo");
