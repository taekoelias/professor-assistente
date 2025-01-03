import { z } from "zod";
import { TipoConteudoItem } from "../../../domain/conteudo.domain";
import ConteudoRepository from "../../../infra/repository/conteudo.repository";

export default class GetAllConteudoUsecase {
  constructor(readonly repository: ConteudoRepository) {}

  async execute(): Promise<Output[]> {
    return this.repository.getConteudos().then((data) => {
      if (data) {
        return data.map<Output>((item) => ({
          id: item.id,
          items: item.itens.map((sub) => ({
            id: sub.id,
            conteudo: sub.conteudo,
            tipo: sub.tipo,
            descricao: sub.descricao,
            metadados: sub.metadados,
          })),
          temas: item.temas.map((tag) => tag.id),
          assuntos: item.assuntos.map((tag) => tag.id),
          niveis: item.niveis.map((tag) => tag.id),
          dataAlteracao: item.dataAlteracao?.toISOString(),
        }));
      }

      return new Array<Output>();
    });
  }
}

export const GetAllConteudoOutputSchema = z.object({
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

type Output = z.infer<typeof GetAllConteudoOutputSchema>;
