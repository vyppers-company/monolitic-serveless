import { PaginateResult } from 'mongoose';
import { ICategory } from 'src/domain/entity/category';
import { IContentEntity } from 'src/domain/entity/contents';
import { IProfile } from 'src/domain/entity/user.entity';

export interface IQueriesSearchUser extends ICategory {
  value?: string;
  limit?: number;
  page?: number;
  verified?: string;
  limitByUser?: number;
}

export interface IFilterPaginate {
  limit: number;
  page: number;
}

export interface ISearchUseCase {
  searchUser: (
    queries: IQueriesSearchUser,
    myId: string,
  ) => Promise<PaginateResult<IProfile>>;
  searchUserV2: (
    queries: IQueriesSearchUser,
    myId: string,
  ) => Promise<PaginateResult<IContentEntity>>;
  searchUserByCriteria: (
    myId: string,
    limit: number,
    page: number,
    type: string,
    isFollowed: string,
    sort: string,
    isVerified,
  ) => Promise<PaginateResult<IProfile>>;
}
