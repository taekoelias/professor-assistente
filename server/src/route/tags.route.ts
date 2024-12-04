import { FastifyRequest } from "fastify";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import {
  AddTagInputSchema,
  AddTagOutputSchema,
  AddTagUsecase,
} from "../application/usecase/add-tag.usecase";
import { DeleteTagUsecase } from "../application/usecase/delete-tag.usecase";
import {
  GetAllOutputSchema,
  GetAllTagsUsecase,
} from "../application/usecase/get-all-tags.usecase";
import {
  GetByTipoOutputSchema,
  GetByTipoTagsUsecase,
} from "../application/usecase/get-by-tipo-tags.usecase";
import {
  UpdateTagInputSchema,
  UpdateTagOutputSchema,
  UpdateTagUsecase,
} from "../application/usecase/update-tag.usecase";
import { TipoTag } from "../domain/tags.domain";
import { TagsPrismaDatabaseConnection } from "../infra/database/prisma/tags-prisma-database-connection";
import { TagsRepositoryPrismaDatabase } from "../infra/repository/tags.repository";

export const tagsRoute: FastifyPluginAsyncZod = async (app) => {
  const connection = new TagsPrismaDatabaseConnection();
  const repository = new TagsRepositoryPrismaDatabase(connection);

  app.put(
    "/tags/:tipo/:id",
    {
      schema: {
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
    },
    async (
      request: FastifyRequest<{
        Params: { tipo: string; id: string };
        Body: Record<string, any>;
      }>
    ) => {
      const { tipo, id } = request.params;
      const data = { ...request.body, tipo };
      const usecase = new UpdateTagUsecase(repository);
      const input = UpdateTagInputSchema.parse(data);
      return usecase.execute(id, input);
    }
  );

  app.delete(
    "/tags/:tipo/:id",
    {
      schema: {
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
    },
    async (
      request: FastifyRequest<{
        Params: { tipo: string; id: string };
        Body: Record<string, any>;
      }>
    ) => {
      const { tipo, id } = request.params;
      const usecase = new DeleteTagUsecase(repository);
      return usecase.execute(id, tipo);
    }
  );

  app.post(
    "/tags/:tipo",
    {
      schema: {
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
    },
    async (
      request: FastifyRequest<{
        Params: { tipo: string };
        Body: Record<string, any>;
      }>
    ) => {
      const { tipo } = request.params;
      const data = { ...request.body, tipo };
      const usecase = new AddTagUsecase(repository);
      const input = AddTagInputSchema.parse(data);
      return usecase.execute(input);
    }
  );

  app.get(
    "/tags",
    {
      schema: {
        description: "Recupera todas as tags",
        response: {
          200: z.array(GetAllOutputSchema),
          204: z.array(GetAllOutputSchema),
        },
      },
    },
    async (request) => {
      const usecase = new GetAllTagsUsecase(repository);
      return usecase.execute();
    }
  );

  app.get(
    "/tags/:tipo",
    {
      schema: {
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
    },
    async (
      request: FastifyRequest<{
        Params: { tipo: string };
      }>
    ) => {
      const { tipo } = request.params;
      const usecase = new GetByTipoTagsUsecase(repository);
      return usecase.execute(tipo);
    }
  );
};
