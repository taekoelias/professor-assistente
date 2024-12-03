import { Tags } from "@prisma/client";
import { prisma } from "../../../lib/prisma-client";
import DatabaseConnection from "../database-connection";

export class TagsPrismaDatabaseConnection implements DatabaseConnection<Tags> {
  getAll(): Promise<Tags[]> {
    return prisma.tags.findMany();
  }
  getOne(value: Partial<Tags>): Promise<Tags> {
    return prisma.tags.findUniqueOrThrow({
      where: {
        tipo: value.tipo,
      },
    });
  }
  add(value: Tags): Promise<Tags> {
    throw new Error("Method not implemented.");
  }
  update(newValue: Tags): Promise<Tags> {
    return prisma.tags.update({
      data: newValue,
      where: {
        tipo: newValue.tipo,
      },
    });
  }
  delete(newValue: Tags): Promise<Tags> {
    throw new Error("Method not implemented.");
  }
}
