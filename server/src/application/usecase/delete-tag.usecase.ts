import TagsRepository from "../../infra/repository/tags.repository";

export class DeleteTagUsecase {
  constructor(readonly repository: TagsRepository) {}

  async execute(id: string, tipo: string): Promise<void> {
    const tag = await this.repository.getById(id);
    if (tag) {
      if (tag.tipo !== tipo)
        throw new Error("Tag não associada ao tipo informado");

      return this.repository.delete(id);
    } else {
      throw new Error("Tag inexistente");
    }
  }
}
