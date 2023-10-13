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
    const profile = await this.getProfileImage(profileId || myId);
    const result = await this.contentRepository.findPaginated(
      {
        offset,
        limit,
        populate: [
          {
            path: 'owner',
            model: 'User',
            select: 'arroba name',
          },
        ],
      },
      {
        owner: profileId || myId,
        type,
      },
    );

    return {
      totalDocs: result.totalDocs,
      limit: result.limit,
      totalPages: result.totalPages,
      page: result.page,
      offset: result.offset,
      pagingCounter: result.pagingCounter,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      docs: result.docs.map((doc: any) => ({
        _id: doc._id,
        type: doc.type,
        owner: {
          _id: doc.owner._id,
          name: doc.owner.name,
          arroba: doc.owner.arroba,
          profileImage: profile?.contents.length ? profile?.contents[0] : null,
        },
        canEdit: String(doc.owner._id) === String(myId) ? true : false,
        contents: doc.contents,
        likersId: doc.likersId,
        payed: doc.payed,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      })),
    };
  }

  async getContent(
    profileId: string,
    myId: string,
    contentId: string,
  ): Promise<IContentEntity> {
    const profile = await this.getProfileImage(profileId || myId);
    const content: any = await this.contentRepository.findOne(
      {
        owner: profileId || myId,
        _id: contentId,
      },
      null,
      {
        populate: [
          {
            path: 'owner',
            model: 'User',
            select: 'arroba name',
          },
        ],
      },
    );

    return {
      contents: content.contents,
      likersId: content.likersId,
      owner: {
        _id: content.owner._id,
        name: content.owner.name,
        arroba: content.owner.arroba,
        profileImage: profile?.contents.length ? profile?.contents[0] : null,
      },
      text: content.text,
      type: content.type,
      canEdit: String(content.owner._id) === String(myId) ? true : false,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
    };
  }
  async getProfileImage(owner: string): Promise<IContentEntity> {
    const content = await this.contentRepository.findOne({
      owner,
      type: ITypeContent.PROFILE,
    });
    return content
      ? {
          _id: String(content._id),
          owner: content.owner,
          contents: content.contents,
        }
      : null;
  }
}
