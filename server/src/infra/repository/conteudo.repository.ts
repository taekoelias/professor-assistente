import { ItensConteudo, TagsConteudo } from "@prisma/client";
import { Conteudo } from "../../domain/conteudo.domain";
import { TipoTag } from "../../domain/tags.domain";
import DatabaseConnection from "../database/database-connection";
import { ConteudoDatabase } from "../database/prisma/conteudo-prisma-database-connections";

export default interface ConteudoRepository {
  getById(id: string): Promise<Conteudo | undefined>;
  getConteudos(): Promise<Conteudo[]>;
  add(tag: Omit<Conteudo, "id">): Promise<Conteudo>;
  update(id: string, tag: Omit<Conteudo, "id">): Promise<Conteudo>;
  delete(id: string): Promise<void>;
}

export class ConteudoRepositoryPrismaDatabase implements ConteudoRepository {
  constructor(readonly connection: DatabaseConnection<ConteudoDatabase>) {}

  getById(id: string): Promise<Conteudo | undefined> {
    throw new Error("Method not implemented.");
  }
  getConteudos(): Promise<Conteudo[]> {
    return this.connection.getAll().then((data) =>
      data.map(
        (item) =>
          ({
            id: item.id,
            itens: item.itens?.map((subItem) => ({
              id: subItem.id,
              conteudo: subItem.valor,
              tipo: subItem.tipo,
              descricao: subItem.descricao,
              metadados: subItem.metadados,
            })),
            temas: item.tags
              ?.filter((tag) => tag.tipoTag === TipoTag.TEMA)
              .map((tag) => ({ id: tag.tagsId })),
            assuntos: item.tags
              ?.filter((tag) => tag.tipoTag === TipoTag.ASSUNTO)
              .map((tag) => ({ id: tag.tagsId })),
            niveis: item.tags
              ?.filter((tag) => tag.tipoTag === TipoTag.NIVEL)
              .map((tag) => ({ id: tag.tagsId })),
            dataAlteracao: item.dataAlteracao,
            dataCriacao: item.dataCriacao,
          } as Conteudo)
      )
    );
  }
  add(data: Omit<Conteudo, "id">): Promise<Conteudo> {
    return this.connection
      .add({
        ...data,
        excluido: false,
        dataAlteracao: data.dataAlteracao ?? new Date(),
        dataCriacao: data.dataCriacao ?? new Date(),
        itens: new Array<ItensConteudo>(),
        tags: new Array<TagsConteudo>(),
      })
      .then(
        (data) =>
          ({
            id: data.id,
            dataAlteracao: data.dataAlteracao,
            dataCriacao: data.dataCriacao,
          } as Conteudo)
      );
  }
  update(id: string, data: Omit<Conteudo, "id">): Promise<Conteudo> {
    return this.connection
      .update(id, {
        ...data,
        excluido: false,
        dataAlteracao: data.dataAlteracao ?? new Date(),
        dataCriacao: data.dataCriacao ?? new Date(),
        itens: new Array<ItensConteudo>(),
        tags: new Array<TagsConteudo>(),
      })
      .then(
        (data) =>
          ({
            id: data.id,
            dataAlteracao: data.dataAlteracao,
            dataCriacao: data.dataCriacao,
          } as Conteudo)
      );
  }
  delete(id: string): Promise<void> {
    return this.connection.delete(id);
  }
}
