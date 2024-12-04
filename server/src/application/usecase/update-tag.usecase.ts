import { z } from "zod";
import { TipoTag } from "../../domain/tags.domain";
import TagsRepository from "../../infra/repository/tags.repository";

export class UpdateTagUsecase {
  constructor(readonly repository: TagsRepository) {}

  async execute(id: string, input: Input): Promise<Output> {
    UpdateTagInputSchema.parse(input);

    const tagOriginal = await this.repository.getById(id);
    if (tagOriginal === undefined) throw new Error("Tag inexistente");
    if (tagOriginal.tipo !== input.tipo)
      throw new Error("Tag não associada ao tipo informado");

    const tags = await this.repository.getTagsByTipo(input.tipo);
    if (tags) {
      const exists = tags.some(
        (tag) =>
          tag.valor.toLocaleUpperCase() === input.valor.toLocaleUpperCase() &&
          tag.id !== id
      );
      if (exists) throw new Error("Já existente outra tag com o mesmo nome.");

      return this.repository
        .update(id, {
          tipo: input.tipo,
          valor: input.valor,
          metadata:
            input.background || input.font
              ? { background: input.background, font: input.font }
              : undefined,
        })
        .then(
          (data) =>
            ({
              id: data.id,
              tipo: data.tipo,
              valor: data.valor,
              metadata: data.metadata,
            } as Output)
        );
    } else {
      throw new Error("Tipo de tag inexistente");
    }
  }
}

export const UpdateTagInputSchema = z.object({
  tipo: z.nativeEnum(TipoTag, { message: "Tipo não preenchido" }),
  valor: z.string({ message: "Valor não preenchido" }),
  background: z.string().optional(),
  font: z.string().optional(),
});

type Input = z.infer<typeof UpdateTagInputSchema>;

export const UpdateTagOutputSchema = z.object({
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

type Output = z.infer<typeof UpdateTagOutputSchema>;
