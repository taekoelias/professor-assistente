import { Tags as TagsEntity } from "@prisma/client";
import { Tags } from "../../domain/tags.domain";
import DatabaseConnection from "../database/database-connection";

export default interface TagsRepository {
  getTagsByTipo(tipo: string): Promise<Tags | undefined>;
  getTags(): Promise<Tags[]>;
  update(tag: Tags): Promise<Tags>;
}

export class TagsRepositoryPrismaDatabase implements TagsRepository {
  constructor(readonly connection: DatabaseConnection<TagsEntity>) {}
  getTagsByTipo(tipo: string): Promise<Tags | undefined> {
    return this.connection.getOne({ tipo }).then((data) => {
      if (data) {
        return {
          tipo: data.tipo,
          valores: data.valores.map((valor) => ({
            valor: valor.valor,
            cor: valor.cor,
          })),
        };
      }
      return undefined;
    });
  }

  getTags(): Promise<Tags[]> {
    return this.connection.getAll().then((data) => {
      if (data && data.length > 0) {
        return data.map((tag) => ({
          tipo: tag.tipo,
          valores: tag.valores.map((valor) => ({
            valor: valor.valor,
            cor: valor.cor,
          })),
        }));
      }
      return [];
    });
  }

  update(tag: Tags): Promise<Tags> {
    return this.connection
      .update({ id: "", tipo: tag.tipo, valores: tag.valores })
      .then((data) => {
        return {
          tipo: data.tipo,
          valores: data.valores.map((valor) => ({
            valor: valor.valor,
            cor: valor.cor,
          })),
        };
      });
  }
}
