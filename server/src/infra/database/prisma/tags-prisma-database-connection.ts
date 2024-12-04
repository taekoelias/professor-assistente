import { Tags } from "@prisma/client";
import { prisma } from "../../../lib/prisma-client";
import DatabaseConnection from "../database-connection";

export class TagsPrismaDatabaseConnection implements DatabaseConnection<Tags> {
  getAll(value: Partial<Tags>): Promise<Tags[]> {
    return prisma.tags.findMany({
      where: {
        tipo: value.tipo,
        excluido: false,
      },
    });
  }
  getOne(id: string): Promise<Tags> {
    return prisma.tags.findUniqueOrThrow({
      where: {
        id,
        excluido: false,
      },
    });
  }
  add(value: Omit<Tags, "id">): Promise<Tags> {
    return prisma.tags.create({
      data: value,
    });
  }
  update(id: string, newValue: Omit<Tags, "id">): Promise<Tags> {
    return prisma.tags.update({
      data: newValue,
      where: {
        id,
        tipo: newValue.tipo,
      },
    });
  }
  delete(id: string): Promise<void> {
    return prisma.tags
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
