import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IDenunciateUseCase } from '../interfaces/usecases/denunciate.interface';
import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { DenunciateRepository } from 'src/data/mongoose/repositories/denunciate.repository';

@Injectable()
export class DenunciateService implements IDenunciateUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly contentRepository: ContentRepository,
    private readonly denunciateRepository: DenunciateRepository,
  ) {}
  async send(myId: string, contentId: string, reason: string) {
    const me = await this.userRepository.findOne({ _id: myId });

    if (!me) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    const content = await this.contentRepository.findOne({ _id: contentId });

    if (!content) {
      throw new HttpException('content not found', HttpStatus.NOT_FOUND);
    }
    if (content.owner === myId) {
      throw new HttpException('you cant report yourself', HttpStatus.CONFLICT);
    }
    await this.denunciateRepository.create({
      complainant: myId,
      contentId: content._id,
      reason,
      reported: content.owner,
    });
  }
}
