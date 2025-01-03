import { ItensConteudo } from "@prisma/client";
import { prisma } from "../../../lib/prisma-client";
import DatabaseConnection from "../database-connection";

export class ItemConteudoPrismaDatabaseConnection
  implements
    DatabaseConnection<ItensConteudo, { conteudoId: string; id: string }>
{
  getAll(
    value: Partial<Omit<ItensConteudo, "metadados">>
  ): Promise<ItensConteudo[]> {
    return prisma.itensConteudo.findMany({
      where: {
        ...value,
      },
    });
  }

  getOne(id: {
    conteudoId: string;
    id: string;
  }): Promise<ItensConteudo | null> {
    return prisma.itensConteudo.findUnique({
      where: {
        ...id,
        excluido: false,
      },
    });
  }

  add(value: Omit<ItensConteudo, "id">): Promise<ItensConteudo> {
    return prisma.itensConteudo.create({
      data: {
        ...value,
      },
    });
  }

  update(
    id: { conteudoId: string; id: string },
    newValue: Omit<ItensConteudo, "id">
  ): Promise<ItensConteudo> {
    return prisma.itensConteudo.update({
      data: newValue,
      where: {
        ...id,
      },
    });
  }
  delete(id: { conteudoId: string; id: string }): Promise<void> {
    return prisma.itensConteudo
      .update({
        data: {
          excluido: true,
        },
        where: {
          ...id,
        },
      })
      .then(() => {});
  }
}
