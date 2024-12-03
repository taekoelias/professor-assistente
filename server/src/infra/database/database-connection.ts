export default interface DatabaseConnection<T> {
  getAll(): Promise<T[]>;
  getOne(value: Partial<T>): Promise<T>;
  add(value: T): Promise<T>;
  update(newValue: T): Promise<T>;
  delete(newValue: T): Promise<T>;
}
