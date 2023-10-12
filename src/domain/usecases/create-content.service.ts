import { Injectable, BadRequestException } from '@nestjs/common';
import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { CreateContentDto } from 'src/presentation/dtos/create-content.dto';
import { ICreateContentUseCase } from '../interfaces/usecases/create-content.interface';
import { ITypeContent } from '../entity/contents';
import { UserRepository } from 'src/data/mongoose/repositories/user.repository';

@Injectable()
export class CreateContentService implements ICreateContentUseCase {
  constructor(
    private readonly contentRepositoru: ContentRepository,
    private readonly userrepo: UserRepository,
  ) {}
  async create(dto: CreateContentDto, owner: string): Promise<any> {
    const user = await this.userrepo.findOne({ _id: owner });
    if (dto.text && dto.type === ITypeContent.PROFILE) {
      throw new BadRequestException('profile content dont needs text');
    }
    if (dto.type === ITypeContent.PROFILE && dto.contents.length > 1) {
      throw new BadRequestException(
        'profile content dont needs more than 1 content',
      );
    }
    if (dto.type === ITypeContent.PROFILE) {
      const hasProfileImage = await this.contentRepositoru.findOne({
        owner,
        type: dto.type,
      });
      if (hasProfileImage) {
        await this.contentRepositoru.deleteById(hasProfileImage._id);
      }
    }

    await this.contentRepositoru.create({
      ...dto,
      owner,
    });
  }
}
