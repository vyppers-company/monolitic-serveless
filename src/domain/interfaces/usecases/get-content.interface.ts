import { PaginateResult } from 'mongoose';
import { IContentEntity, ITypeContent } from 'src/app/domain/entities/contents';

export interface IContentsUseCase {
  getContents: (
    profileid: string,
    myId: string,
    type: ITypeContent,
    limit: number,
    offset: number,
  ) => Promise<PaginateResult<IContentEntity>>;
  getContent: (
    profileId: string,
    myId: string,
    contentId: string,
  ) => Promise<IContentEntity>;
  getProfileImage: (
    owner: string,
  ) => Promise<Pick<IContentEntity, 'contents' | 'type'>>;
}
