import { ItensConteudo } from "@prisma/client";
import { ConteudoItem, TipoConteudoItem } from "../../domain/conteudo.domain";
import DatabaseConnection from "../database/database-connection";

export default interface ConteudoItemRepository {
  getConteudoItems(
    options?: Partial<{ conteudoId: string; tipo: TipoConteudoItem }>
  ): Promise<ConteudoItem[]>;
  add(
    conteudoId: string,
    data: Omit<ConteudoItem, "id">
  ): Promise<ConteudoItem>;
  update(
    conteudoId: string,
    id: string,
    data: Omit<ConteudoItem, "id">
  ): Promise<ConteudoItem>;
  delete(conteudoId: string, id: string): Promise<void>;
}

export class ConteudoItemRepositoryPrismaDatabase
  implements ConteudoItemRepository
{
  constructor(
    readonly connection: DatabaseConnection<
      ItensConteudo,
      { conteudoId: string; id: string }
    >
  ) {}

  getConteudoItems(
    options: Partial<{ conteudoId: string; tipo: TipoConteudoItem }>
  ): Promise<ConteudoItem[]> {
    return this.connection.getAll({ ...options }).then((data) =>
      data.map(
        (item) =>
          ({
            id: item.id,
            conteudo: item.valor,
            tipo: item.tipo,
            descricao: item.descricao,
            metadados: item.metadados,
          } as ConteudoItem)
      )
    );
  }
  add(
    conteudoId: string,
    data: Omit<ConteudoItem, "id">
  ): Promise<ConteudoItem> {
    return this.connection
      .add({
        conteudoId,
        valor: data.conteudo,
        descricao: data.descricao ?? null,
        tipo: data.tipo,
        metadados: data.metadados,
        excluido: false,
      })
      .then(
        (item) =>
          ({
            id: item.id,
            conteudo: item.valor,
            tipo: item.tipo,
            descricao: item.descricao,
            metadados: item.metadados,
          } as ConteudoItem)
      );
  }
  update(
    conteudoId: string,
    id: string,
    data: Omit<ConteudoItem, "id">
  ): Promise<ConteudoItem> {
    return this.connection
      .update(
        { id, conteudoId },
        {
          conteudoId: conteudoId,
          valor: data.conteudo,
          descricao: data.descricao ?? null,
          tipo: data.tipo,
          metadados: data.metadados,
          excluido: false,
        }
      )
      .then(
        (item) =>
          ({
            id: item.id,
            conteudo: item.valor,
            tipo: item.tipo,
            descricao: item.descricao,
            metadados: item.metadados,
          } as ConteudoItem)
      );
  }
  delete(conteudoId: string, id: string): Promise<void> {
    return this.connection.delete({ id, conteudoId });
  }
}
