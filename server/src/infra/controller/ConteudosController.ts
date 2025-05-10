import { z } from "zod";
import AddConteudosUseCase, {
  AddConteudoInputSchema,
  AddConteudoOutputSchema,
} from "../../application/usecase/conteudo/add-conteudo.usecase";
import DeleteConteudosUseCase from "../../application/usecase/conteudo/delete-conteudo.usecase";
import GetAllConteudosUseCase, {
  GetAllConteudoOutputSchema,
} from "../../application/usecase/conteudo/get-all-conteudo.usecase";
import GetOneConteudoUseCase, {
  GetOneConteudoOutputSchema,
} from "../../application/usecase/conteudo/get-one-conteudo.usecase";
import UpdateConteudosUseCase, {
  UpdateConteudoInputSchema,
  UpdateConteudoOutputSchema,
} from "../../application/usecase/conteudo/update-conteudo.usecase";
import HttpServer from "../http/http-server";

export class ConteudosController {
  constructor(
    readonly httpServer: HttpServer,
    readonly getAllConteudos: GetAllConteudosUseCase,
    readonly getOneConteudos: GetOneConteudoUseCase,
    readonly addConteudos: AddConteudosUseCase,
    readonly updateConteudos: UpdateConteudosUseCase,
    readonly deleteConteudos: DeleteConteudosUseCase
  ) {
    this.register();
  }

  private register() {
    this.httpServer.register(
      "put",
      "/conteudos/:id",
      async (request) => {
        const { id } = request.params;
        const data = request.body;
        const input = UpdateConteudoInputSchema.parse(data);
        return this.updateConteudos.execute(id, input);
      },
      {
        schema: {
          tags: ["conteudo"],
          summary: "Altera um conteudo",
          description: "Altera um conteudo",
          response: {
            200: UpdateConteudoOutputSchema,
          },
          params: z.object({
            id: z.string({
              description:
                "Identificador unico do conteudo que será atualizado",
            }),
          }),
          body: UpdateConteudoInputSchema,
        },
      }
    );

    this.httpServer.register(
      "delete",
      "/conteudos/:id",
      async (request) => {
        const { id } = request.params;
        return this.deleteConteudos.execute(id);
      },
      {
        schema: {
          tags: ["conteudo"],
          summary: "Remove o conteudo",
          description: "Remove o conteudo",
          response: {
            200: z.void(),
          },
          params: z.object({
            id: z.string({
              description: "Identificador unico do conteudo que será removida",
            }),
          }),
        },
      }
    );

    this.httpServer.register(
      "post",
      "/conteudos",
      async (request) => {
        const data = request.body;
        const input = AddConteudoInputSchema.parse(data);
        return this.addConteudos.execute(input);
      },
      {
        schema: {
          tags: ["conteudo"],
          summary: "Cria novo conteudo informado",
          description: "Cria novo conteudo informado",
          response: {
            201: AddConteudoOutputSchema,
          },
          body: AddConteudoOutputSchema,
        },
      }
    );

    this.httpServer.register(
      "get",
      "/conteudos",
      async () => {
        return this.getAllConteudos.execute();
      },
      {
        schema: {
          tags: ["conteudo"],
          summary: "Recupera todas as conteudos",
          description: "Recupera todas as conteudos",
          response: {
            200: z.array(GetAllConteudoOutputSchema),
            204: z.void(),
          },
        },
      }
    );

    this.httpServer.register(
      "get",
      "/conteudos/:id",
      async (request) => {
        const { id } = request.params;
        return this.getOneConteudos.execute(id);
      },
      {
        schema: {
          tags: ["conteudo"],
          summary: "Recupera conteudos a partir do identificador",
          description: "Recupera conteudos a partir do identificador",
          response: {
            200: z.array(GetOneConteudoOutputSchema),
            204: z.void(),
          },
          params: z.object({
            id: z.string({
              description:
                "Identificador unico do conteudo que será recuperado",
            }),
          }),
        },
      }
    );
  }
}
