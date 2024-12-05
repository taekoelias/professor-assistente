import { z } from "zod";
import { TipoTag } from "../../../domain/tags.domain";
import TagsRepository from "../../../infra/repository/tags.repository";

export default class AddTagUsecase {
  constructor(readonly repository: TagsRepository) {}

  async execute(input: Input): Promise<Output> {
    AddTagInputSchema.parse(input);

    const tags = await this.repository.getTagsByTipo(input.tipo);
    if (tags) {
      const index = tags.findIndex(
        (tag) =>
          tag.valor.toLocaleUpperCase() === input.valor.toLocaleUpperCase()
      );
      if (index !== -1) {
        throw new Error("Tag já cadastrada");
      }
      return this.repository
        .add({
          tipo: input.tipo,
          valor: input.valor,
          metadata:
            input.background || input.font
              ? { background: input.background, font: input.font }
              : undefined,
        })
        .then((data) => ({
          id: data.id,
          tipo: data.tipo,
          valor: data.valor,
          metadata: data.metadata
            ? {
                background: data.metadata?.background,
                font: data.metadata?.font,
              }
            : undefined,
        }));
    } else {
      throw new Error("Tipo de tag inexistente");
    }
  }
}

export const AddTagInputSchema = z.object({
  tipo: z.nativeEnum(TipoTag, { message: "Tipo não preenchido" }),
  valor: z.string({ message: "Valor não preenchido" }),
  background: z.string().optional(),
  font: z.string().optional(),
});

type Input = z.infer<typeof AddTagInputSchema>;

export const AddTagOutputSchema = z.object({
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

type Output = z.infer<typeof AddTagOutputSchema>;
