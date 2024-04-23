/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  ClientSession,
  Document,
  FilterQuery,
  Model,
  //@ts-ignore
  PaginateModel,
  //@ts-ignore
  PaginateResult,
  Query,
  QueryOptions,
  QueryWithHelpers,
} from 'mongoose';
import {
  BaseInterfaceRepository,
  IRelationParams,
} from './base.interface.repository';

export interface ConditionalsFilters {
  isDeleted?: boolean;
  isFreezed?: boolean;
  isBanned?: boolean;
}

export type BaseModel<T extends Document> = Model<T> & PaginateModel<T>;
export abstract class BaseAbstractRepository<T extends Document>
  implements BaseInterfaceRepository<T>
{
  private model: BaseModel<T>;

  protected constructor(model: BaseModel<T>) {
    this.model = model;
  }

  public async create(
    data: Pick<T, Exclude<keyof T, keyof Document>> | { id?: string },
  ): Promise<T> {
    const newDocument = new this.model(data);
    return await newDocument.save();
  }

  public async startSession(): Promise<ClientSession> {
    return this.model.db.startSession();
  }

  public async findOneById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  public async findOne(
    filter?: FilterQuery<T>,
    projection?: unknown | null,
    options?: QueryOptions | null,
  ): Promise<Query<T | null, T>> {
    return await this.model.findOne(filter, projection, options);
  }

  public async find(
    filter: FilterQuery<T>,
    projection?: unknown | null,
    options?: QueryOptions | null,
  ): Promise<QueryWithHelpers<Array<T>, T>> {
    return this.model.find(filter, projection, options);
  }

  public async findWithRelations(
    filter: FilterQuery<T>,
    relations: IRelationParams[],
    projection?: unknown | null,
    options?: QueryOptions | null,
  ): Promise<T[]> {
    const query = this.model.find(filter, projection, options);
    relations.forEach((relation) => {
      query.populate(relation);
    });
    return query.exec();
  }

  public async findAll(): Promise<T[]> {
    return await this.model.find();
  }

  async deleteById(id: any): Promise<void> {
    const model = await this.findOneById(id);
    if (model) {
      await this.model.deleteOne({ _id: model._id });
    }
  }

  async findPaginated(
    options: any,
    filters?: any,
  ): Promise<PaginateResult<any>> {
    const paginatedResults = await this.model.paginate(filters ? filters : {}, {
      ...options,
    });
    return {
      totalDocs: paginatedResults.totalDocs,
      limit: paginatedResults.limit,
      totalPages: paginatedResults.totalPages,
      page: paginatedResults.page,
      pagingCounter: paginatedResults.pagingCounter,
      hasPrevPage: paginatedResults.hasPrevPage,
      hasNextPage: paginatedResults.hasNextPage,
      prevPage: paginatedResults.prevPage,
      nextPage: paginatedResults.nextPage,
      docs: paginatedResults.docs,
      offset: paginatedResults.offset,
    };
  }
}
