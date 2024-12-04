import { TipoTag } from "../src/domain/tags.domain";
import { prisma } from "../src/lib/prisma-client";

async function seed() {
  await prisma.tags.createMany({
    data: [
      { tipo: TipoTag.TEMA, valor: "tema exemplo" },
      { tipo: TipoTag.ASSUNTO, valor: "assunto exemplo" },
      { tipo: TipoTag.NIVEL, valor: "nível exemplo" },
    ],
  });
}

seed().then(() => {
  console.log("Database seeded!");
});
