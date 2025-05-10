import AddConteudoUsecase from "../application/usecase/conteudo/add-conteudo.usecase";
import DeleteConteudoUsecase from "../application/usecase/conteudo/delete-conteudo.usecase";
import GetAllConteudosUsecase from "../application/usecase/conteudo/get-all-conteudo.usecase";
import GetByTipoConteudosUsecase from "../application/usecase/conteudo/get-one-conteudo.usecase";
import UpdateConteudoUsecase from "../application/usecase/conteudo/update-conteudo.usecase";
import { ConteudosController } from "../infra/controller/ConteudosController";
import { ConteudoPrismaDatabaseConnection } from "../infra/database/prisma/conteudo-prisma-database-connections";
import { ItemConteudoPrismaDatabaseConnection } from "../infra/database/prisma/item-conteudo-prisma-database-connections";
import { TagConteudoPrismaDatabaseConnection } from "../infra/database/prisma/tag-conteudo-prisma-database-connections";
import { TagsPrismaDatabaseConnection } from "../infra/database/prisma/tags-prisma-database-connection";
import HttpServer from "../infra/http/http-server";
import { ConteudoItemRepositoryPrismaDatabase } from "../infra/repository/conteudo-item.repository";
import { ConteudoTagRepositoryPrismaDatabase } from "../infra/repository/conteudo-tag.repository";
import { ConteudoRepositoryPrismaDatabase } from "../infra/repository/conteudo.repository";
import { TagsRepositoryPrismaDatabase } from "../infra/repository/tags.repository";

export function conteudosAppConfiguration(httpServer: HttpServer) {
  const tagRepository = new TagsRepositoryPrismaDatabase(
    new TagsPrismaDatabaseConnection()
  );
  const conteudoRepository = new ConteudoRepositoryPrismaDatabase(
    new ConteudoPrismaDatabaseConnection()
  );
  const itemConteudoRepository = new ConteudoItemRepositoryPrismaDatabase(
    new ItemConteudoPrismaDatabaseConnection()
  );
  const tagconteudoRepository = new ConteudoTagRepositoryPrismaDatabase(
    new TagConteudoPrismaDatabaseConnection()
  );
  const getAll = new GetAllConteudosUsecase(conteudoRepository);
  const getByTipo = new GetByTipoConteudosUsecase(conteudoRepository);
  const add = new AddConteudoUsecase(
    conteudoRepository,
    itemConteudoRepository,
    tagconteudoRepository,
    tagRepository
  );
  const update = new UpdateConteudoUsecase(
    conteudoRepository,
    itemConteudoRepository,
    tagconteudoRepository,
    tagRepository
  );
  const remove = new DeleteConteudoUsecase(conteudoRepository);
  new ConteudosController(httpServer, getAll, getByTipo, add, update, remove);
}
