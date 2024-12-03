import fastify from "fastify";
import { TagsRoute } from "./src/route/tags.route";

const server = fastify();

const tagRoutes = new TagsRoute();
tagRoutes.register(server);

server.listen({ port: 3333, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
