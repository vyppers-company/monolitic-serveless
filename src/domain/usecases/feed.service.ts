import { Injectable } from '@nestjs/common';
import { IFeedUseCase } from '../interfaces/usecases/feed.interface';
import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { PaginateResult } from 'mongoose';
import { IContentEntity, ITypeContent } from '../entity/contents';

@Injectable()
export class FeedService implements IFeedUseCase {
  constructor(private readonly contentrepository: ContentRepository) {}
  async feed(type: ITypeContent): Promise<PaginateResult<IContentEntity[]>> {
    const response = await this.contentrepository.findPaginated(
      {
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
    return response;
  }
}
