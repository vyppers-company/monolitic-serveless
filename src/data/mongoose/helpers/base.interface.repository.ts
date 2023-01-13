/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Document,
  FilterQuery,
  //@ts-ignore
  PaginateResult,
  Query,
  QueryOptions,
} from 'mongoose';

export interface BaseInterfaceRepository<T extends Document> {
  create(data: T | any): Promise<T>;

  findOneById(id: string): Promise<T | null>;

  findOne(
    filter?: FilterQuery<T>,
    projection?: any | null,
    options?: QueryOptions | null,
  ): Promise<Query<T | null, T>>;

  findAll(): Promise<T[]>;

  findWithRelations(relations: string[]): Promise<T[]>;

  deleteById(id: string): Promise<void>;

  findPaginated(options: any, filter?: any): Promise<PaginateResult<any>>;
}
