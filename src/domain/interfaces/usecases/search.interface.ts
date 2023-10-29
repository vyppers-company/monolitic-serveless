import { PaginateResult } from 'mongoose';
import { ICategory } from 'src/domain/entity/category';
import { IProfile } from 'src/domain/entity/user.entity';

export interface IQueriesSearchUser extends ICategory {
  value: string;
  limit: number;
  page: number;
  verified: string;
}

export interface ISearchUseCase {
  searchUser: (
    queries: IQueriesSearchUser,
    myId: string,
  ) => Promise<PaginateResult<IProfile>>;
}
