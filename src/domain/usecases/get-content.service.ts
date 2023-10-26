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
    page: number,
  ): Promise<PaginateResult<IContentEntity>> {
    const result = await this.contentRepository.findPaginated(
      {
        sort: { _id: -1 },
        limit: Number(limit),
        page: Number(page),
        populate: [
          {
            path: 'owner',
            model: 'User',
            select: 'vypperID name profileImage',
            populate: [
              {
                path: 'profileImage',
                model: 'Content',
                select: 'contents',
              },
            ],
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
          vypperID: doc.owner.vypperID,
          profileImage: doc.owner.profileImage,
        },
        canEdit: String(doc.owner._id) === String(myId) ? true : false,
        contents: doc.contents.filter((image: string) =>
          doc.payed ? image.includes('-payed') : !image.includes('-payed'),
        ),
        likersId: doc.likersId,
        payed: doc.payed || false,
        text: doc.text,
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
            select: 'vypperID name profileImage',
            populate: [
              {
                path: 'profileImage',
                model: 'Content',
                select: 'contents',
              },
            ],
          },
        ],
      },
    );

    return {
      contents: content.contents.filter((image: string) =>
        content.payed ? image.includes('-payed') : !image.includes('-payed'),
      ),
      likersId: content.likersId,
      owner: {
        _id: content.owner._id,
        name: content.owner.name,
        vypperID: content.owner.vypperID,
        profileImage: content.owner.profileImage,
      },
      text: content.text,
      type: content.type,
      payed: content.payed || false,
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
