import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { IMakeLikeUseCase } from '../interfaces/usecases/make-like.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class MakeLikeService implements IMakeLikeUseCase {
  constructor(private readonly contentRepository: ContentRepository) {}
  async makeLike(contentId: string, myId: string): Promise<void> {
    const content = await this.contentRepository.findOne(
      { _id: contentId },
      { likersId: 1 },
    );
    if (!content) {
      throw new HttpException(
        {
          message: 'content not found',
          reason: 'LikeError',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (content.likersId.includes(myId)) {
      await this.contentRepository.makeLike(
        content._id,
        content.likersId.filter((likers) => likers !== myId),
      );

      return;
    }

    await this.contentRepository.makeLike(content._id, [
      ...content.likersId,
      myId,
    ]);
  }
}
