import { TagsConteudo } from "@prisma/client";
import { TipoTag } from "../../domain/tags.domain";
import DatabaseConnection from "../database/database-connection";

export type ConteudoTag = {
  conteudoId: string;
  tagsId: string;
  tipoTag: TipoTag;
};

export default interface ConteudoTagRepository {
  getConteudoTags(
    options: Partial<{ conteudoId: string; tagsId: string; tipoTag: TipoTag }>
  ): Promise<ConteudoTag[]>;
  add(data: ConteudoTag): Promise<ConteudoTag>;
  delete(conteudoId: string, tagsId: string): Promise<void>;
}

export class ConteudoTagRepositoryPrismaDatabase
  implements ConteudoTagRepository
{
  constructor(
    readonly connection: DatabaseConnection<
      TagsConteudo,
      { conteudoId: string; tagsId: string }
    >
  ) {}
  getConteudoTags(
    options: Partial<{ conteudoId: string; tagsId: string; tipoTag: TipoTag }>
  ): Promise<ConteudoTag[]> {
    return this.connection.getAll({ ...options }).then((data) =>
      data.map(
        (item) =>
          ({
            ...item,
          } as ConteudoTag)
      )
    );
  }
  add(data: ConteudoTag): Promise<ConteudoTag> {
    return this.connection
      .add({
        ...data,
      })
      .then(
        (item) =>
          ({
            ...item,
          } as ConteudoTag)
      );
  }
  delete(conteudoId: string, tagsId: string): Promise<void> {
    return this.connection.delete({ conteudoId, tagsId });
  }
}
