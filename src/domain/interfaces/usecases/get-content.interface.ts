import { PaginateResult } from 'mongoose';
import { IContentEntity, ITypeContent } from 'src/domain/entity/contents';

export interface IContentsUseCase {
  getContents: (
    profileid: string,
    myId: string,
    type: ITypeContent,
    limit: number,
    page: number,
  ) => Promise<PaginateResult<IContentEntity>>;
  getContent: (
    profileId: string,
    myId: string,
    contentId: string,
  ) => Promise<IContentEntity>;
  getProfileImage: (owner: string) => Promise<Pick<IContentEntity, 'owner'>>;
}
