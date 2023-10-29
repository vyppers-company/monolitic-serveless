import { PaginateResult } from 'mongoose';
import { IProfile } from 'src/domain/entity/user.entity';

export interface IBannedQuery {
  limit: number;
  page: number;
}

export interface IBanUserUseCase {
  banUser: (userId: string, myId: string) => Promise<void>;
  unbanUser: (userId: string, myId: string) => Promise<void>;
  listBannedUser: (
    myId: string,
    queries: IBannedQuery,
  ) => Promise<PaginateResult<IProfile> | []>;
}
