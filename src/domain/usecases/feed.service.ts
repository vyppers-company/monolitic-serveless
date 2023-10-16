import { Injectable } from '@nestjs/common';
import { IFeedUseCase } from '../interfaces/usecases/feed.interface';
import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { PaginateResult } from 'mongoose';
import { ITypeContent } from '../entity/contents';

@Injectable()
export class FeedService implements IFeedUseCase {
  constructor(private readonly contentRepository: ContentRepository) {}
  async feed(
    type: ITypeContent,
    myId: string,
    limit: number,
    offset: number,
  ): Promise<PaginateResult<any>> {
    const result = await this.contentRepository.findPaginated(
      {
        offset: offset || 1,
        limit: limit || 10,
        populate: [
          {
            path: 'owner',
            model: 'User',
            select: 'arroba name profileImage',
          },
        ],
      },
      { type },
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
      docs: result.docs
        .map((doc: any) => ({
          _id: doc._id,
          type: doc.type,
          owner: {
            _id: doc.owner._id,
            name: doc.owner.name,
            arroba: doc.owner.arroba,
            profileImage: doc.owner.profileImage,
          },
          canEdit: String(doc.owner._id) === String(myId) ? true : false,
          contents: doc.contents,
          likersId: doc.likersId,
          payed: doc.payed,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        }))
        .sort((a, b) => b.createdAt - a.createdAt),
    };
  }
}
