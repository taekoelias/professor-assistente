import { z } from "zod";
import { TipoTag } from "../../domain/tags.domain";
import TagsRepository from "../../infra/repository/tags.repository";

export class GetByTipoTagsUsecase {
  constructor(readonly repository: TagsRepository) {}

  async execute(tipo: string): Promise<Output[]> {
    return this.repository.getTagsByTipo(tipo).then((data) => {
      if (data) {
        return data.map(
          (tag) =>
            ({
              id: tag.id,
              tipo: tag.tipo,
              valor: tag.valor,
              metadata: tag.metadata
                ? {
                    background: tag.metadata?.background,
                    font: tag.metadata?.font,
                  }
                : undefined,
            } as Output)
        );
      }
      return [];
    });
  }
}

export const GetByTipoOutputSchema = z.object({
  id: z.string(),
  tipo: z.nativeEnum(TipoTag),
  valor: z.string(),
  metadata: z
    .object({
      background: z.string().optional(),
      font: z.string().optional(),
    })
    .optional(),
});

type Output = z.infer<typeof GetByTipoOutputSchema>;