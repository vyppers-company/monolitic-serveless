import { Injectable } from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import { IContentsUseCase } from '../interfaces/usecases/get-content.interface';
import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import {
  IContentEntity,
  IContentEntityExtended,
  ITypeContent,
} from '../entity/contents';
import { decideContent } from 'src/shared/utils/decideContent';

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
            select: 'vypperId name profileImage followers planConfiguration',
            populate: [
              {
                path: 'profileImage',
                model: 'Content',
                select: 'contents',
              },
              {
                path: 'planConfiguration',
                model: 'Plan',
                select: 'subscribers',
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
          vypperId: doc.owner.vypperId,
          profileImage: doc.owner.profileImage,
        },
        isFollowed:
          doc.owner.followers && doc.owner.followers.length
            ? doc.owner.followers.includes(myId)
            : false,
        canEdit: String(doc.owner._id) === String(myId) ? true : false,
        contents: decideContent(doc, myId),
        likersId: doc.likersId,
        planId: doc.planId,
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
  ): Promise<IContentEntityExtended> {
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
            select: 'vypperId name profileImage followers',
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
      contents: decideContent(content, myId),
      likersId: content.likersId,
      owner: {
        _id: content.owner._id,
        name: content.owner.name,
        vypperId: content.owner.vypperId,
        profileImage: content.owner.profileImage,
      },
      isFollowed:
        content.owner.followers && content.owner.followers.length
          ? content.owner.followers.includes(myId)
          : false,
      text: content.text,
      type: content.type,
      planId: content.planId,
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
