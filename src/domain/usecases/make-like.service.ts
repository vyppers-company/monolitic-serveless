import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { IMakeLikeUseCase } from '../interfaces/usecases/make-like.interface';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class MakeLikeService implements IMakeLikeUseCase {
  constructor(private readonly contentRepository: ContentRepository) {}
  async makeLike(contentId: string, myId: string): Promise<void> {
    const content = await this.contentRepository.findOne(
      { _id: contentId },
      { likersId: 1 },
    );
    if (!content) {
      throw new NotFoundException('content not found');
    }

    if (content.likersId.includes(myId)) {
      this.contentRepository
        .makeLike(
          content._id,
          content.likersId.filter((likers) => likers !== myId),
        )
        .then();
      return;
    }

    this.contentRepository
      .makeLike(content._id, [...content.likersId, myId])
      .then();
  }
}
