import { Tags } from "./tags.domain";

export enum TipoConteudoItem {
  TEXTO = "Texto",
  IMAGEM = "Imagem",
  PDF = "PDF",
  LINK = "Link",
  VIDEO = "Video",
  AUDIO = "Audio",
}

export interface ConteudoItem {
  id?: string;
  conteudo: string;
  tipo: TipoConteudoItem;
  descricao?: string;
  metadados?: Record<string, unknown>;
}

export interface Conteudo {
  id: string;
  itens: Array<ConteudoItem>;
  temas: Array<Tags>;
  assuntos: Array<Tags>;
  niveis: Array<Tags>;
  dataCriacao?: Date;
  dataAlteracao?: Date;
}
