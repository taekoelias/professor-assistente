import { TagsConteudo } from "@prisma/client";
import { prisma } from "../../../lib/prisma-client";
import DatabaseConnection from "../database-connection";

export class TagConteudoPrismaDatabaseConnection
  implements
    DatabaseConnection<TagsConteudo, { tagsId: string; conteudoId: string }>
{
  getAll(value: Partial<TagsConteudo>): Promise<TagsConteudo[]> {
    return prisma.tagsConteudo.findMany({
      where: {
        ...value,
      },
    });
  }

  getOne(id: {
    tagsId: string;
    conteudoId: string;
  }): Promise<TagsConteudo | null> {
    return prisma.tagsConteudo.findUnique({
      where: {
        tagsId_conteudoId: id,
      },
    });
  }

  add(value: Omit<TagsConteudo, "id">): Promise<TagsConteudo> {
    return prisma.tagsConteudo.create({
      data: {
        ...value,
      },
    });
  }

  update(
    id: { tagsId: string; conteudoId: string },
    newValue: TagsConteudo
  ): Promise<TagsConteudo> {
    return prisma.tagsConteudo.update({
      data: newValue,
      where: {
        tagsId_conteudoId: id,
      },
    });
  }
  delete(id: { tagsId: string; conteudoId: string }): Promise<void> {
    return prisma.tagsConteudo
      .delete({
        where: {
          tagsId_conteudoId: id,
        },
      })
      .then(() => {});
  }
}
