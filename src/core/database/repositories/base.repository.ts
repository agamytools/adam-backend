// create base sequelize repository with generics
import {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  Model,
  ModelStatic,
  UpdateOptions,
} from 'sequelize';

export class BaseRepository<T extends Model> {
  model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  async create(data: Partial<T>, options?: CreateOptions): Promise<T> {
    // @ts-ignore
    return this.model.create(data, options);
  }

  async findAll(options?: FindOptions): Promise<T[]> {
    return this.model.findAll(options);
  }

  async findById(
    id: number | string,
    options?: FindOptions,
  ): Promise<T | null> {
    return this.model.findByPk(id, options);
  }

  async update(
    data: Partial<T>,
    options: UpdateOptions,
  ): Promise<[number, T[]]> {
    // @ts-ignore
    return this.model.update(data, options);
  }

  async delete(options: DestroyOptions): Promise<number> {
    return this.model.destroy(options);
  }

  async count(options?: FindOptions): Promise<number> {
    return this.model.count(options);
  }

  async findOne(options: FindOptions): Promise<T | null> {
    return this.model.findOne(options);
  }

  async bulkCreate(data: Partial<T>[], options?: CreateOptions): Promise<T[]> {
    // @ts-ignore
    return this.model.bulkCreate(data, options);
  }

  async restore(options: DestroyOptions): Promise<void> {
    await this.model.restore(options);
  }
}
