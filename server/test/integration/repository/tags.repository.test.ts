import { Tags as TagsEntity } from "@prisma/client";
import { randomUUID } from "crypto";
import { Tags, TipoTag } from "../../../src/domain/tags.domain";
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
  getOne(id: string): Promise<TagsEntity> {
    const item = this.database.find((item) => !item.excluido && item.id === id);
    if (item) return Promise.resolve(item);

    return Promise.reject();
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

describe("Tags repository integation test", () => {
  test("Deve adicionar nova tags", async () => {
    const connection = new InMemoryDatabaseConnection();
    const repository = new TagsRepositoryPrismaDatabase(connection);

    const tag = { tipo: TipoTag.TEMA, valor: "test" } as Tags;
    const newTag = await repository.add(tag);
    expect(newTag).toBeDefined();
    expect(connection.database.length).toBe(1);
    expect(connection.database[0].id).toBe(newTag.id);
    expect(connection.database[0].tipo).toBe(newTag.tipo);
    expect(connection.database[0].valor).toBe(newTag.valor);
    expect(connection.database[0].metadata).toBeNull();
    expect(newTag.metadata).toBeUndefined();
  });

  test("Deve remover tags pelo identificador único", async () => {
    const connection = new InMemoryDatabaseConnection();
    const tag = await connection.add({
      tipo: TipoTag.TEMA,
      valor: "test",
      excluido: false,
      metadata: null,
    });
    expect(connection.database.length).toBe(1);

    const repository = new TagsRepositoryPrismaDatabase(connection);
    await repository.delete(tag.id);
    expect(connection.database.length).toBe(1);
    expect(connection.database[0].excluido).toBeTruthy();
  });

  test("Deve atualizar tags pelo identificador único", async () => {
    const connection = new InMemoryDatabaseConnection();
    const tag = await connection.add({
      tipo: TipoTag.TEMA,
      valor: "test",
      excluido: false,
      metadata: null,
    });
    expect(connection.database.length).toBe(1);
    expect(connection.database[0].id).toBe(tag.id);
    expect(connection.database[0].tipo).toBe(tag.tipo);
    expect(connection.database[0].valor).toBe(tag.valor);
    expect(connection.database[0].metadata).toBeNull();

    const repository = new TagsRepositoryPrismaDatabase(connection);
    const updatedTag = await repository.update(tag.id, {
      tipo: TipoTag.TEMA,
      valor: "test1",
      metadata: { background: "#ffffff", font: "#000000" },
    });
    expect(connection.database.length).toBe(1);
    expect(connection.database[0].id).toBe(tag.id);
    expect(connection.database[0].tipo).toBe(updatedTag.tipo);
    expect(connection.database[0].valor).toBe(updatedTag.valor);
    expect(connection.database[0].metadata).toBeDefined();
    expect(connection.database[0].metadata).toBe(updatedTag.metadata);
  });

  test("Deve recuperar todas as tags", async () => {
    const connection = new InMemoryDatabaseConnection();
    await connection.add({
      tipo: TipoTag.TEMA,
      valor: "test",
      excluido: false,
      metadata: null,
    });
    await connection.add({
      tipo: TipoTag.ASSUNTO,
      valor: "test 2",
      excluido: false,
      metadata: null,
    });
    expect(connection.database.length).toBe(2);

    const repository = new TagsRepositoryPrismaDatabase(connection);
    const tags = await repository.getTags();
    expect(connection.database.length).toBe(tags.length);
  });

  test("Deve recuperar todas as tags de um determinado tipo", async () => {
    const connection = new InMemoryDatabaseConnection();
    await connection.add({
      tipo: TipoTag.TEMA,
      valor: "test",
      excluido: false,
      metadata: null,
    });
    await connection.add({
      tipo: TipoTag.ASSUNTO,
      valor: "test 2",
      excluido: false,
      metadata: null,
    });
    expect(connection.database.length).toBe(2);

    const repository = new TagsRepositoryPrismaDatabase(connection);
    const tags = await repository.getTagsByTipo(TipoTag.TEMA);
    expect(tags).toBeDefined();
    expect(tags!.length).toBe(1);
  });

  test("Deve recuperar todas as tags que não foram removidas", async () => {
    const connection = new InMemoryDatabaseConnection();
    const tagRemovida = await connection.add({
      tipo: TipoTag.TEMA,
      valor: "test",
      excluido: false,
      metadata: null,
    });
    await connection.add({
      tipo: TipoTag.ASSUNTO,
      valor: "test 2",
      excluido: false,
      metadata: null,
    });

    connection.delete(tagRemovida.id);
    expect(connection.database.length).toBe(2);

    const repository = new TagsRepositoryPrismaDatabase(connection);
    const tags = await repository.getTags();
    expect(tags).toBeDefined();
    expect(tags.length).toBe(1);
  });
});
