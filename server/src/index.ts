import { conteudosAppConfiguration } from "./config/ConteudoConfig";
import { tagsAppConfiguration } from "./config/TagsConfig";
import { FastifyAdapter } from "./infra/http/http-server";

async function main() {
  const httpServer = new FastifyAdapter();
  tagsAppConfiguration(httpServer);
  conteudosAppConfiguration(httpServer);

  httpServer.listen(3333);
}

main();
