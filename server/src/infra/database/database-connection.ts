export default interface DatabaseConnection<T, ID = string> {
  getAll(value?: Partial<T>): Promise<T[]>;
  getOne(id: ID): Promise<T | null>;
  add(value: Omit<T, "id">): Promise<T>;
  update(id: ID, newValue: Omit<T, "id">): Promise<T>;
  delete(id: ID): Promise<void>;
}
