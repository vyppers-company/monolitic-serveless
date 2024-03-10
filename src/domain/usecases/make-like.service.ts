import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { IMakeLikeUseCase } from '../interfaces/usecases/make-like.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { VapidNotificationService } from './vapidNotification.service';
import { IUploadContent } from '../entity/contents';

@Injectable()
export class MakeLikeService implements IMakeLikeUseCase {
  constructor(
    private readonly contentRepository: ContentRepository,
    private readonly userRepository: UserRepository,
    private readonly vapidNotificationService: VapidNotificationService,
  ) {}
  async makeLike(contentId: string, myId: string): Promise<void> {
    const user = await this.userRepository.findOne(
      {
        _id: myId,
        isBanned: false,
      },
      { profileImage: 1, vypperId: 1, isBanned: 1 },
      {
        populate: [
          { path: 'profileImage', model: 'Content', select: 'contents' },
        ],
      },
    );
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_ACCEPTABLE);
    }

    const content = await this.contentRepository.findOne(
      { _id: contentId },
      { likersId: 1, owner: 1 },
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
    } else {
      await this.contentRepository.makeLike(content._id, [
        ...content.likersId,
        myId,
      ]);
    }
    //criar fila e desacoplar envio de notifacao no futuro
    if (myId !== content.owner) {
      //trocar chamada direta por uma fila

      await this.vapidNotificationService.sendNotification(
        {
          date: new Date().toISOString(),
          title: `nova notificação`,
          //@ts-ignore
          image: user?.profileImage?.contents[0] || null,
          message: `@${user.vypperId} ${
            content.likersId.includes(myId) ? 'descurtiu' : 'curtiu'
          } sua foto`,
        },
        myId,
        content.owner,
      );
    }
  }
}
