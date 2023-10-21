import { PaginateResult } from 'mongoose';
import { IProfile } from 'src/domain/entity/user.entity';

export interface ISearchUseCase {
  searchUser: (
    value: string,
    limit: number,
    page: number,
  ) => Promise<PaginateResult<IProfile>>;
}
