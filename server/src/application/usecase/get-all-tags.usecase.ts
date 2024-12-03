import { Tags } from "../../domain/tags.domain";
import TagsRepository from "../../infra/repository/tags.repository";

export class GetAllTagsUsecase {
  constructor(readonly repository: TagsRepository) {}

  async execute(): Promise<Tags[]> {
    return this.repository.getTags();
  }
}
