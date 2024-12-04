import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { tagsRoute } from "./src/route/tags.route";

const server = fastify();
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(swagger, {
  openapi: {
    info: {
      title: "API Professor assistente",
      description: "Documentação da API do Professor assistente",
      version: "1.0.0",
    },
  },
  // Importante adicionar para fazer o parse do schema
  transform: jsonSchemaTransform,
});
server.register(swaggerUi, {
  routePrefix: "/docs",
});

server.register(tagsRoute);

server.listen({ port: 3333, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
