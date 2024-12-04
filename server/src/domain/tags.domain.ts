export type TagMetadata = {
  font: string;
  background: string;
};

export enum TipoTag {
  TEMA = "Tema",
  ASSUNTO = "Assunto",
  NIVEL = "Nível",
}

export interface Tags {
  id: string;
  tipo: TipoTag;
  valor: string;
  metadata?: Partial<TagMetadata>;
}
