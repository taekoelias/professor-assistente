import { z } from "zod";
import { TipoConteudoItem } from "../../../domain/conteudo.domain";
import ConteudoRepository from "../../../infra/repository/conteudo.repository";

export default class GetAllConteudoUsecase {
  constructor(readonly repository: ConteudoRepository) {}

  async execute(id: string): Promise<Output | undefined> {
    return this.repository.getById(id).then((data) => {
      if (data) {
        return {
          id: data.id,
          items: data.itens.map((sub) => ({
            id: sub.id,
            conteudo: sub.conteudo,
            tipo: sub.tipo,
            descricao: sub.descricao,
            metadados: sub.metadados,
          })),
          temas: data.temas.map((tag) => tag.id),
          assuntos: data.assuntos.map((tag) => tag.id),
          niveis: data.niveis.map((tag) => tag.id),
          dataAlteracao: data.dataAlteracao?.toISOString(),
        };
      }

      return undefined;
    });
  }
}

export const GetOneConteudoOutputSchema = z.object({
  id: z.string().uuid(),
  items: z.array(
    z.object({
      id: z.string().optional(),
      conteudo: z.string().or(z.string().url()),
      tipo: z.nativeEnum(TipoConteudoItem),
      descricao: z.string().optional(),
      metadados: z.record(z.unknown()).optional(),
    })
  ),
  temas: z.array(z.string().uuid()),
  assuntos: z.array(z.string().uuid()),
  niveis: z.array(z.string().uuid()),
  dataAlteracao: z
    .date()
    .transform((date) => date.toISOString())
    .optional(),
});

type Output = z.infer<typeof GetOneConteudoOutputSchema>;
