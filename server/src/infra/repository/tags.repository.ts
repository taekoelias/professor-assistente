import { Tags as TagsEntity } from "@prisma/client";
import { Tags, TipoTag } from "../../domain/tags.domain";
import DatabaseConnection from "../database/database-connection";

export default interface TagsRepository {
  getById(id: string): Promise<Tags | undefined>;
  getTagsByTipo(tipo: string): Promise<Tags[] | undefined>;
  getTags(): Promise<Tags[]>;
  add(tag: Omit<Tags, "id">): Promise<Tags>;
  update(id: string, tag: Omit<Tags, "id">): Promise<Tags>;
  delete(id: string): Promise<void>;
}

export class TagsRepositoryPrismaDatabase implements TagsRepository {
  constructor(readonly connection: DatabaseConnection<TagsEntity>) {}
  getById(id: string): Promise<Tags | undefined> {
    return this.connection.getOne(id).then((data) => ({
      id: data.id,
      tipo: data.tipo as TipoTag,
      valor: data.valor,
      metadata: data.metadata,
    }));
  }

  getTagsByTipo(tipo: string): Promise<Tags[] | undefined> {
    return this.connection.getAll({ tipo }).then((data) => {
      if (data && data.length > 0) {
        return data.map((tag) => ({
          id: tag.id,
          tipo: tag.tipo as TipoTag,
          valor: tag.valor,
          metadata: tag.metadata,
        }));
      }
      return undefined;
    });
  }

  getTags(): Promise<Tags[]> {
    return this.connection.getAll({}).then((data) => {
      if (data && data.length > 0) {
        return data.map((tag) => ({
          id: tag.id,
          tipo: tag.tipo as TipoTag,
          valor: tag.valor,
          metadata: tag.metadata,
        }));
      }
      return [];
    });
  }

  add(tag: Omit<Tags, "id">): Promise<Tags> {
    return this.connection
      .add({
        tipo: tag.tipo.toString(),
        excluido: false,
        valor: tag.valor,
        metadata: tag.metadata,
      })
      .then((data) => {
        return {
          id: data.id,
          tipo: data.tipo as TipoTag,
          valor: tag.valor,
          metadata: tag.metadata,
        };
      });
  }

  delete(id: string): Promise<void> {
    return this.connection.delete(id);
  }

  update(id: string, tag: Omit<Tags, "id">): Promise<Tags> {
    return this.connection
      .update(id, {
        tipo: tag.tipo.toString(),
        excluido: false,
        valor: tag.valor,
        metadata: tag.metadata,
      })
      .then((data) => {
        return {
          id: data.id,
          tipo: data.tipo as TipoTag,
          valor: tag.valor,
          metadata: tag.metadata,
        };
      });
  }
}
