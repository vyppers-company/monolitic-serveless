/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Document,
  FilterQuery,
  //@ts-ignore
  PaginateResult,
  Query,
  QueryOptions,
} from 'mongoose';

export interface IRelationParams {
  path: string;
  model: string;
  select: string;
  populate?: IRelationParams;
}

export interface BaseInterfaceRepository<T extends Document> {
  create(data: T | any): Promise<T>;

  findOneById(id: string): Promise<T | null>;

  findOne(
    filter?: FilterQuery<T>,
    projection?: any | null,
    options?: QueryOptions | null,
  ): Promise<Query<T | null, T>>;

  findAll(): Promise<T[]>;

  findWithRelations(
    filter: FilterQuery<T>,
    relations: IRelationParams[],
    projection?: unknown | null,
    options?: QueryOptions | null,
  ): Promise<T[]>;

  deleteById(id: string): Promise<void>;

  findPaginated(options: any, filter?: any): Promise<PaginateResult<any>>;
}
