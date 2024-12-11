export default interface DatabaseConnection<T> {
  getAll(value: Partial<T>): Promise<T[]>;
  getOne(id: string): Promise<T | null>;
  add(value: Omit<T, "id">): Promise<T>;
  update(id: string, newValue: Omit<T, "id">): Promise<T>;
  delete(id: string): Promise<void>;
}
