import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import fastify, { FastifyInstance } from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

export default interface HttpServer {
  register(
    method: string,
    url: string,
    callback: Function,
    options?: Record<string, unknown>
  ): void;
  listen(port: number): void;
}

export class FastifyAdapter implements HttpServer {
  app: FastifyInstance;

  constructor() {
    this.app = fastify();
    this.app.setValidatorCompiler(validatorCompiler);
    this.app.setSerializerCompiler(serializerCompiler);

    this.app.register(swagger, {
      openapi: {
        info: {
          title: "API Professor assistente",
          description: "Documentação da API do Professor assistente",
          version: "1.0.0",
        },
        tags: [
          { name: "tags", description: "Operações realizadas sobre tags" },
        ],
      },
      // Importante adicionar para fazer o parse do schema
      transform: jsonSchemaTransform,
    });
    this.app.register(swaggerUi, {
      routePrefix: "/docs",
    });
  }
  register(
    method: string,
    url: string,
    callback: Function,
    options?: Record<string, unknown>
  ): void {
    this.app.after(() => {
      this.app.withTypeProvider<ZodTypeProvider>().route({
        ...options,
        method,
        url,
        handler: (request, reply) => {
          return callback(request, reply);
        },
      });
    });
  }
  listen(port: number): void {
    this.app.listen({ port, host: "0.0.0.0" }, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`API documentarion running at ${address}/docs`);
      console.log(`Server listening at ${address}`);
    });
  }
}
