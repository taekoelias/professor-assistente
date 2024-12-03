import { prisma } from "../src/lib/prisma-client";

async function seed() {
  await prisma.tags.createMany({
    data: [
      { tipo: "TEMA", valores: [] },
      { tipo: "ASSUNTO", valores: [] },
      { tipo: "NIVEL", valores: [] },
    ],
  });
}

seed().then(() => {
  console.log("Database seeded!");
});
