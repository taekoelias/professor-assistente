import { z } from "zod";
import AddTagsUseCase, {
  AddTagInputSchema,
  AddTagOutputSchema,
} from "../../application/usecase/tags/add-tag.usecase";
import DeleteTagsUseCase from "../../application/usecase/tags/delete-tag.usecase";
import GetAllTagsUseCase, {
  GetAllOutputSchema,
} from "../../application/usecase/tags/get-all-tags.usecase";
import GetTagsByTipoUseCase, {
  GetByTipoOutputSchema,
} from "../../application/usecase/tags/get-by-tipo-tags.usecase";
import UpdateTagsUseCase, {
  UpdateTagInputSchema,
  UpdateTagOutputSchema,
} from "../../application/usecase/tags/update-tag.usecase";
import { TipoTag } from "../../domain/tags.domain";
import HttpServer from "../http/http-server";

export class TagsController {
  constructor(
    readonly httpServer: HttpServer,
    readonly getAllTags: GetAllTagsUseCase,
    readonly getTagsByTipo: GetTagsByTipoUseCase,
    readonly addTags: AddTagsUseCase,
    readonly updateTags: UpdateTagsUseCase,
    readonly deleteTags: DeleteTagsUseCase
  ) {
    this.register();
  }

  private register() {
    this.httpServer.register(
      "put",
      "/tags/:tipo/:id",
      async (request) => {
        const { tipo, id } = request.params;
        const data = { ...request.body, tipo };
        const input = UpdateTagInputSchema.parse(data);
        return this.updateTags.execute(id, input);
      },
      {
        schema: {
          tags: ["tags"],
          summary: "Altera tag associada ao tipo informado",
          description: "Altera tag associada ao tipo informado",
          response: {
            200: UpdateTagOutputSchema,
          },
          params: z.object({
            id: z.string({
              description: "Identificador unico da tag que será removida",
            }),
            tipo: z.nativeEnum(TipoTag, {
              description: "Tipo cuja tag está associada",
            }),
          }),
          body: UpdateTagInputSchema,
        },
      }
    );

    this.httpServer.register(
      "delete",
      "/tags/:tipo/:id",
      async (request) => {
        const { tipo, id } = request.params;
        return this.deleteTags.execute(id, tipo);
      },
      {
        schema: {
          tags: ["tags"],
          summary: "Remove a tag associada ao tipo informado",
          description: "Remove a tag associada ao tipo informado",
          response: {
            200: z.void(),
          },
          params: z.object({
            id: z.string({
              description: "Identificador unico da tag que será removida",
            }),
            tipo: z.nativeEnum(TipoTag, {
              description: "Tipo cuja tag está associada",
            }),
          }),
        },
      }
    );

    this.httpServer.register(
      "post",
      "/tags/:tipo",
      async (request) => {
        const { tipo } = request.params;
        const data = { ...request.body, tipo };
        const input = AddTagInputSchema.parse(data);
        return this.addTags.execute(input);
      },
      {
        schema: {
          tags: ["tags"],
          summary: "Cria nova tag associada ao tipo informado",
          description: "Cria nova tag associada ao tipo informado",
          response: {
            201: AddTagOutputSchema,
          },
          params: z.object({
            tipo: z.nativeEnum(TipoTag, {
              description: "Tipo cuja tag está associada",
            }),
          }),
          body: AddTagInputSchema,
        },
      }
    );

    this.httpServer.register(
      "get",
      "/tags",
      async () => {
        return this.getAllTags.execute();
      },
      {
        schema: {
          tags: ["tags"],
          summary: "Recupera todas as tags",
          description: "Recupera todas as tags",
          response: {
            200: z.array(GetAllOutputSchema),
            204: z.array(GetAllOutputSchema),
          },
        },
      }
    );

    this.httpServer.register(
      "get",
      "/tags/:tipo",
      async (request) => {
        const { tipo } = request.params;
        return this.getTagsByTipo.execute(tipo);
      },
      {
        schema: {
          tags: ["tags"],
          summary: "Recupera tags a partir de um tipo",
          description: "Recupera tags a partir de um tipo",
          response: {
            200: z.array(GetByTipoOutputSchema),
            204: z.array(GetByTipoOutputSchema),
          },
          params: z.object({
            tipo: z.nativeEnum(TipoTag, {
              description: "Tipo cuja tag está associada",
            }),
          }),
        },
      }
    );
  }
}
