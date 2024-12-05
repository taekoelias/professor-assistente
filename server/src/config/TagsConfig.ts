import AddTagUsecase from "../application/usecase/tags/add-tag.usecase";
import DeleteTagUsecase from "../application/usecase/tags/delete-tag.usecase";
import GetAllTagsUsecase from "../application/usecase/tags/get-all-tags.usecase";
import GetByTipoTagsUsecase from "../application/usecase/tags/get-by-tipo-tags.usecase";
import UpdateTagUsecase from "../application/usecase/tags/update-tag.usecase";
import { TagsController } from "../infra/controller/TagsController";
import { TagsPrismaDatabaseConnection } from "../infra/database/prisma/tags-prisma-database-connection";
import HttpServer from "../infra/http/http-server";
import { TagsRepositoryPrismaDatabase } from "../infra/repository/tags.repository";

export function tagsAppConfiguration(httpServer: HttpServer) {
  const databaseConnection = new TagsPrismaDatabaseConnection();
  const repository = new TagsRepositoryPrismaDatabase(databaseConnection);
  const getAll = new GetAllTagsUsecase(repository);
  const getByTipo = new GetByTipoTagsUsecase(repository);
  const add = new AddTagUsecase(repository);
  const update = new UpdateTagUsecase(repository);
  const remove = new DeleteTagUsecase(repository);
  new TagsController(httpServer, getAll, getByTipo, add, update, remove);
}
