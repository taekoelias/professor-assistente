import ConteudoRepository from "../../../infra/repository/conteudo.repository";

export default class DeleteConteudoUsecase {
  constructor(readonly repository: ConteudoRepository) {}

  async execute(id: string): Promise<void> {
    const base = await this.repository.getById(id);
    if (base === undefined) {
      throw new Error("Conteúdo não encontrado");
    }

    return this.repository.delete(id);
  }
}
