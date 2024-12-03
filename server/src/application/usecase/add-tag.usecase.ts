import { z } from "zod";
import { Tags } from "../../domain/tags.domain";
import TagsRepository from "../../infra/repository/tags.repository";

export class AddTagUsecase {
  constructor(readonly repository: TagsRepository) {}

  async execute(input: Input): Promise<Tags> {
    AddTagInputSchema.parse(input);

    const tags = await this.repository.getTagsByTipo(input.tipo);
    if (tags) {
      const index = tags.valores.findIndex(
        (tag) =>
          tag.valor.toLocaleUpperCase() === input.valor.toLocaleUpperCase()
      );
      if (index === -1) {
        tags.valores.push({ valor: input.valor, cor: input.cor });
      } else {
        tags.valores[index].cor = input.cor;
      }
      return this.repository.update(tags);
    } else {
      throw new Error("Tipo de tag inexistente");
    }
  }
}

export const AddTagInputSchema = z.object({
  tipo: z.string({ message: "Tipo não preenchido" }),
  valor: z.string({ message: "Valor não preenchido" }),
  cor: z.string({ message: "Cor não preenchido" }),
});

type Input = z.infer<typeof AddTagInputSchema>;
