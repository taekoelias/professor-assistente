import { Tags as TagsEntity } from "@prisma/client";
import { randomUUID } from "crypto";
import AddTags from "../../../src/application/usecase/tags/add-tag.usecase";
import UpdateTags from "../../../src/application/usecase/tags/update-tag.usecase";
import { TipoTag } from "../../../src/domain/tags.domain";
import DatabaseConnection from "../../../src/infra/database/database-connection";
import { TagsRepositoryPrismaDatabase } from "../../../src/infra/repository/tags.repository";

class InMemoryDatabaseConnection implements DatabaseConnection<TagsEntity> {
  database: TagsEntity[] = [];
  constructor() {}
  getAll(value: Partial<TagsEntity>): Promise<TagsEntity[]> {
    const result = this.database.filter(
      (item) =>
        !item.excluido && (value.tipo === undefined || item.tipo === value.tipo)
    );
    if (result) return Promise.resolve(result);

    return Promise.resolve([]);
  }
  getOne(id: string): Promise<TagsEntity | null> {
    const item = this.database.find((item) => !item.excluido && item.id === id);
    if (item) return Promise.resolve(item);

    return Promise.resolve(null);
  }
  add(value: Omit<TagsEntity, "id">): Promise<TagsEntity> {
    const item = { ...value, id: randomUUID().toString() };
    this.database.push(item);
    return Promise.resolve(item);
  }
  update(id: string, newValue: Omit<TagsEntity, "id">): Promise<TagsEntity> {
    const item = { ...newValue, id };
    const index = this.database.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.database.splice(index, 1, item);
      return Promise.resolve(item);
    }

    return Promise.reject();
  }
  delete(id: string): Promise<void> {
    const index = this.database.findIndex((item) => item.id === id);
    if (index !== -1) {
      const item = this.database[index];
      item.excluido = true;
      this.database.splice(index, 1, item);
      return Promise.resolve();
    }

    return Promise.reject();
  }
}

describe("Tags use cases integation test", () => {
  test("Deve adicionar nova tags", async () => {
    const connection = new InMemoryDatabaseConnection();
    const repository = new TagsRepositoryPrismaDatabase(connection);
    const usecase = new AddTags(repository);

    const newTag = await usecase.execute({
      tipo: TipoTag.TEMA,
      valor: "teste",
    });
    expect(newTag).toBeDefined();
    expect(newTag.id).toBeDefined();
    expect(newTag.tipo).toBe(TipoTag.TEMA);
    expect(newTag.valor).toBe("teste");
    expect(newTag.metadata).toBeUndefined();

    const base = await connection.getOne(newTag.id);
    expect(base).toBeDefined();
    expect(base?.tipo).toBe(newTag.tipo);
    expect(base?.valor).toBe(newTag.valor);
  });
  test("Deve lançar exceção quando adicionar tag já existente", async () => {
    const connection = new InMemoryDatabaseConnection();
    const repository = new TagsRepositoryPrismaDatabase(connection);
    const usecase = new AddTags(repository);

    await connection.add({
      tipo: TipoTag.TEMA,
      valor: "teste",
      excluido: false,
      metadata: null,
    });

    expect(
      async () =>
        await usecase.execute({
          tipo: TipoTag.TEMA,
          valor: "teste",
        })
    ).rejects.toThrow(new Error("Tag já cadastrada"));
  });
  test("Deve alterar tag existente", async () => {
    const connection = new InMemoryDatabaseConnection();
    const repository = new TagsRepositoryPrismaDatabase(connection);
    const usecase = new UpdateTags(repository);

    const tag = await connection.add({
      tipo: TipoTag.TEMA,
      valor: "teste",
      excluido: false,
      metadata: null,
    });

    const newTag = await usecase.execute(tag.id, {
      tipo: TipoTag.TEMA,
      valor: "teste1",
    });
    expect(newTag).toBeDefined();
    expect(newTag.id).toBeDefined();
    expect(newTag.tipo).toBe(TipoTag.TEMA);
    expect(newTag.valor).toBe("teste1");
    expect(newTag.metadata).toBeUndefined();

    const base = await connection.getOne(newTag.id);
    expect(base).toBeDefined();
    expect(base?.tipo).toBe(newTag.tipo);
    expect(base?.valor).toBe(newTag.valor);
  });
  test("Deve lançar exceção ao alterar tag inexistente", async () => {
    const connection = new InMemoryDatabaseConnection();
    const repository = new TagsRepositoryPrismaDatabase(connection);
    const usecase = new UpdateTags(repository);

    await connection.add({
      tipo: TipoTag.TEMA,
      valor: "teste",
      excluido: false,
      metadata: null,
    });

    expect(
      async () =>
        await usecase.execute("id", {
          tipo: TipoTag.TEMA,
          valor: "teste1",
        })
    ).rejects.toThrow(new Error("Tag inexistente"));
  });
  test("Deve lançar exceção ao alterar tipo da tag", async () => {
    const connection = new InMemoryDatabaseConnection();
    const repository = new TagsRepositoryPrismaDatabase(connection);
    const usecase = new UpdateTags(repository);

    const data = await connection.add({
      tipo: TipoTag.TEMA,
      valor: "teste",
      excluido: false,
      metadata: null,
    });

    expect(
      async () =>
        await usecase.execute(data.id, {
          tipo: TipoTag.ASSUNTO,
          valor: "teste1",
        })
    ).rejects.toThrow(new Error("Tag não associada ao tipo informado"));
  });
  test("Deve lançar exceção ao alterar tag para valor já existente", async () => {
    const connection = new InMemoryDatabaseConnection();
    const repository = new TagsRepositoryPrismaDatabase(connection);
    const usecase = new UpdateTags(repository);

    await connection.add({
      tipo: TipoTag.TEMA,
      valor: "teste1",
      excluido: false,
      metadata: null,
    });

    const data = await connection.add({
      tipo: TipoTag.TEMA,
      valor: "teste",
      excluido: false,
      metadata: null,
    });

    expect(
      async () =>
        await usecase.execute(data.id, {
          tipo: TipoTag.TEMA,
          valor: "teste1",
        })
    ).rejects.toThrow(new Error("Já existente outra tag com o mesmo nome."));
  });
});
