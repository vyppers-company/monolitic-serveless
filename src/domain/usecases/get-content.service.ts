import { Injectable } from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import { IContentsUseCase } from '../interfaces/usecases/get-content.interface';
import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { IContentEntity, ITypeContent } from '../entity/contents';

@Injectable()
export class GetContentService implements IContentsUseCase {
  constructor(private readonly contentRepository: ContentRepository) {}
  async getContents(
    profileId: string,
    myId: string,
    type: ITypeContent,
    limit: number,
    offset: number,
  ): Promise<PaginateResult<IContentEntity>> {
    const contents = await this.contentRepository.findPaginated(
      {
        offset,
        limit,
      },
      {
        owner: profileId || myId,
        type,
      },
    );

    return {
      ...contents,
      canEdit: !profileId && myId ? true : false,
    };
  }
  async getContent(
    profileId: string,
    myId: string,
    contentId: string,
  ): Promise<IContentEntity> {
    const content = await this.contentRepository.findOne({
      owner: profileId,
      _id: contentId,
    });

    return {
      comments: content.comments,
      contents: content.contents,
      giftersId: content.giftersId,
      likersId: content.likersId,
      owner: content.owner,
      text: content.text,
      type: content.type,
      canEdit: profileId === myId ? true : false,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
    };
  }
  async getProfileImage(
    owner: string,
  ): Promise<Pick<IContentEntity, 'contents' | 'type'>> {
    return await this.contentRepository.findOne({
      owner,
      type: ITypeContent.PROFILE,
    });
  }
}
