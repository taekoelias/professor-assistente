import { z } from "zod";
import {
  Conteudo,
  ConteudoItem,
  TipoConteudoItem,
} from "../../../domain/conteudo.domain";
import { Tags, TipoTag } from "../../../domain/tags.domain";
import ConteudoItemRepository from "../../../infra/repository/conteudo-item.repository";
import ConteudoTagRepository from "../../../infra/repository/conteudo-tag.repository";
import ConteudoRepository from "../../../infra/repository/conteudo.repository";
import TagsRepository from "../../../infra/repository/tags.repository";
import { fileToDataUrl } from "../../../utils/file-util";

export default class AddConteudoUsecase {
  constructor(
    readonly repository: ConteudoRepository,
    readonly conteudoItemRepository: ConteudoItemRepository,
    readonly conteudoTagRepository: ConteudoTagRepository,
    readonly tagsRepository: TagsRepository
  ) {}

  async execute(input: Input): Promise<Output> {
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
          conteudo: item.conteudo,
          tipo: item.tipo,
          descricao: item.descricao,
        };
      }

      itens.push(newItem);
    }

    if (temas.length === 0)
      throw new Error("Não foram informadas tags de 'Tema' para o conteúdo.");

    if (assuntos.length === 0)
      throw new Error(
        "Não foram informadas tags de 'Assunto' para o conteúdo."
      );

    if (niveis.length === 0)
      throw new Error("Não foram informadas tags de 'Nível' para o conteúdo.");

    if (itens.length === 0)
      throw new Error("Não foram informados itens para o conteúdo.");

    const data = {
      itens: new Array<ConteudoItem>(),
      assuntos: new Array<Tags>(),
      temas: new Array<Tags>(),
      niveis: new Array<Tags>(),
    } as Conteudo;

    const conteudo = await this.repository.add(data);

    const newItems = await Promise.all(
      itens.map(async (item) => {
        return await this.conteudoItemRepository.add(conteudo.id, { ...item });
      })
    );
    const newTemas = await Promise.all(
      temas.map(async (tema) => {
        return await this.conteudoTagRepository.add({
          conteudoId: conteudo.id,
          tagsId: tema,
          tipoTag: TipoTag.TEMA,
        });
      })
    );
    const newAssuntos = await Promise.all(
      assuntos.map(async (assunto) => {
        return await this.conteudoTagRepository.add({
          conteudoId: conteudo.id,
          tagsId: assunto,
          tipoTag: TipoTag.ASSUNTO,
        });
      })
    );
    const newNiveis = await Promise.all(
      niveis.map(async (nivel) => {
        return await this.conteudoTagRepository.add({
          conteudoId: conteudo.id,
          tagsId: nivel,
          tipoTag: TipoTag.NIVEL,
        });
      })
    );

    return {
      id: conteudo.id,
      items: newItems,
      temas: newTemas.map((tema) => tema.tagsId),
      assuntos: newAssuntos.map((assunto) => assunto.tagsId),
      niveis: newNiveis.map((nivel) => nivel.tagsId),
    };
  }
}

export const AddConteudoInputSchema = z.object({
  items: z.array(
    z.object({
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

type Input = z.infer<typeof AddConteudoInputSchema>;

export const AddConteudoOutputSchema = z.object({
  id: z.string(),
  items: z.array(
    z.object({
      conteudo: z.string().or(z.string().url()),
      tipo: z.nativeEnum(TipoConteudoItem),
      descricao: z.string().optional(),
      metadados: z.record(z.any()).optional(),
    })
  ),
  temas: z.array(z.string().uuid()),
  assuntos: z.array(z.string().uuid()),
  niveis: z.array(z.string().uuid()),
});

type Output = z.infer<typeof AddConteudoOutputSchema>;
