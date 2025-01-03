import { z } from "zod";
import {
  ConteudoItem,
  TipoConteudoItem,
} from "../../../domain/conteudo.domain";
import { Tags, TipoTag } from "../../../domain/tags.domain";
import ConteudoRepository from "../../../infra/repository/conteudo.repository";
import TagsRepository from "../../../infra/repository/tags.repository";
import { fileToDataUrl } from "../../../utils/file-util";

export default class UpdateConteudoUsecase {
  constructor(
    readonly repository: ConteudoRepository,
    readonly tagsRepository: TagsRepository
  ) {}

  async execute(id: string, input: Input): Promise<Output> {
    const base = await this.repository.getById(id);
    if (base === undefined) {
      throw new Error("Conteúdo não encontrado");
    }

    const temas = new Array<string>();
    if (input.temas && input.temas.length > 0) {
      const allTemas = await this.tagsRepository.getTagsByTipo(TipoTag.TEMA);
      input.temas
        .filter((t) => allTemas?.some((tema) => tema.id === t))
        .forEach((t) => temas.push(t));
    }

    const assuntos = new Array<string>();
    if (input.assuntos && input.assuntos.length > 0) {
      const allAssuntos = await this.tagsRepository.getTagsByTipo(
        TipoTag.ASSUNTO
      );
      input.assuntos
        .filter((t) => allAssuntos?.some((assunto) => assunto.id === t))
        .forEach((t) => assuntos.push(t));
    }

    const niveis = new Array<string>();
    if (input.niveis && input.niveis.length > 0) {
      const allNiveis = await this.tagsRepository.getTagsByTipo(TipoTag.NIVEL);
      input.niveis
        .filter((t) => allNiveis?.some((nivei) => nivei.id === t))
        .forEach((t) => niveis.push(t));
    }

    const itens = new Array<ConteudoItem>();
    for (let i = 0; i <= input.items.length; i++) {
      const item = input.items[i];
      let newItem: ConteudoItem;
      if (typeof item.conteudo === "object") {
        const file = item.conteudo as unknown as File;
        const dataUrl = await fileToDataUrl(file);
        newItem = {
          id: item.id,
          conteudo: dataUrl as string,
          tipo: item.tipo,
          descricao: item.descricao,
          metadados: {
            name: file.name,
            contentType: file.type,
            size: file.size,
          },
        };
      } else {
        newItem = {
          id: item.id,
          conteudo: item.conteudo,
          tipo: item.tipo,
          descricao: item.descricao,
          metadados: item.metadados,
        };
      }

      itens.push(newItem);
    }

    return this.repository.update(id, {
      itens,
      assuntos: assuntos.map((item) => ({ id: item } as Tags)),
      temas: temas.map((item) => ({ id: item } as Tags)),
      niveis: niveis.map((item) => ({ id: item } as Tags)),
      dataAlteracao: new Date(),
    });
  }
}

export const UpdateConteudoInputSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().optional(),
      conteudo: z.instanceof(File).or(z.string()).or(z.string().url()),
      tipo: z.nativeEnum(TipoConteudoItem),
      descricao: z.string().optional(),
      metadados: z.record(z.any()).optional(),
    }),
    { message: "Deve conter ao menos um item para o conteúdo" }
  ),
  temas: z.array(z.string().uuid(), {
    message: "Deve conter ao menos um tema",
  }),
  assuntos: z.array(z.string().uuid(), {
    message: "Deve conter ao menos um assunto",
  }),
  niveis: z.array(z.string().uuid(), {
    message: "Deve conter ao menos um nível",
  }),
});

type Input = z.infer<typeof UpdateConteudoInputSchema>;

export const UpdateConteudoOutputSchema = z.object({
  id: z.string(),
});

type Output = z.infer<typeof UpdateConteudoOutputSchema>;
