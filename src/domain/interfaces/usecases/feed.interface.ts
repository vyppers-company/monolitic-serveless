import { PaginateResult } from 'mongoose';
import { IContentEntity, ITypeContent } from 'src/domain/entity/contents';

export interface IFeedUseCase {
  feed: (
    type: ITypeContent,
    myId: string,
  ) => Promise<PaginateResult<IContentEntity[]>>;
}
