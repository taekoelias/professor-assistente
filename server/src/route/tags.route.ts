import { FastifyInstance, FastifyRequest } from "fastify";
import {
  AddTagInputSchema,
  AddTagUsecase,
} from "../application/usecase/add-tag.usecase";
import { GetAllTagsUsecase } from "../application/usecase/get-all-tags.usecase";
import { TagsPrismaDatabaseConnection } from "../infra/database/prisma/tags-prisma-database-connection";
import TagsRepository, {
  TagsRepositoryPrismaDatabase,
} from "../infra/repository/tags.repository";

export class TagsRoute {
  repository: TagsRepository;

  constructor() {
    const connection = new TagsPrismaDatabaseConnection();
    this.repository = new TagsRepositoryPrismaDatabase(connection);
  }

  register(app: FastifyInstance) {
    app.post(
      "/tags/:tipo",
      (
        request: FastifyRequest<{
          Params: { tipo: string };
          Body: Record<string, any>;
        }>
      ) => {
        const { tipo } = request.params;
        const data = { ...request.body, tipo };
        const usecase = new AddTagUsecase(this.repository);
        const input = AddTagInputSchema.parse(data);
        return usecase.execute(input);
      }
    );

    app.get("/tags", (request) => {
      const usecase = new GetAllTagsUsecase(this.repository);
      return usecase.execute();
    });
  }
}
