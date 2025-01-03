import { Conteudos, ItensConteudo, TagsConteudo } from "@prisma/client";
import { prisma } from "../../../lib/prisma-client";
import DatabaseConnection from "../database-connection";

export type ConteudoDatabase = Conteudos & {
  itens: ItensConteudo[];
  tags: TagsConteudo[];
};

export class ConteudoPrismaDatabaseConnection
  implements DatabaseConnection<ConteudoDatabase>
{
  getAll(value: Partial<ConteudoDatabase>): Promise<ConteudoDatabase[]> {
    return prisma.conteudos
      .findMany({
        where: {
          excluido: false,
          itens: {
            some: {
              tipo: {
                in: value.itens?.map((item) => item.tipo),
              },
            },
          },
          tags: {
            some: {
              tagsId: {
                in: value.tags?.map((tag) => tag.tagsId),
              },
            },
          },
        },
        include: {
          tags: true,
          itens: true,
        },
      })
      .then((itens) =>
        itens.map(
          (item) =>
            ({
              id: item.id,
              itens: item.itens,
              tags: item.tags,
              dataCriacao: item.dataCriacao,
              dataAlteracao: item.dataAlteracao,
            } as ConteudoDatabase)
        )
      );
  }

  getOne(id: string): Promise<ConteudoDatabase | null> {
    return prisma.conteudos
      .findUnique({
        where: {
          id,
          excluido: false,
        },
        include: {
          tags: true,
          itens: true,
        },
      })
      .then((item) =>
        item != null
          ? ({
              id: item.id,
              itens: item.itens,
              tags: item.tags,
              dataCriacao: item.dataCriacao,
              dataAlteracao: item.dataAlteracao,
            } as ConteudoDatabase)
          : null
      );
  }

  add(value: Omit<ConteudoDatabase, "id">): Promise<ConteudoDatabase> {
    return prisma.conteudos
      .create({
        data: {},
      })
      .then((data) => ({
        ...data,
        itens: new Array<ItensConteudo>(),
        tags: new Array<TagsConteudo>(),
      }));
  }

  update(
    id: string,
    newValue: Omit<ConteudoDatabase, "id">
  ): Promise<ConteudoDatabase> {
    return prisma.conteudos
      .update({
        data: {
          dataAlteracao: new Date(),
        },
        where: {
          id,
        },
      })
      .then((data) => ({
        ...data,
        itens: new Array<ItensConteudo>(),
        tags: new Array<TagsConteudo>(),
      }));
  }
  delete(id: string): Promise<void> {
    return prisma.conteudos
      .update({
        data: {
          excluido: true,
        },
        where: {
          id,
        },
      })
      .then(() => {});
  }
}
