import { Injectable, BadRequestException } from '@nestjs/common';
import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { CreateContentDto } from 'src/presentation/dtos/create-content.dto';
import { ICreateContentUseCase } from '../interfaces/usecases/create-content.interface';
import { ITypeContent } from '../entity/contents';

@Injectable()
export class CreateContentService implements ICreateContentUseCase {
  constructor(private readonly contentRepositoru: ContentRepository) {}
  async create(dto: CreateContentDto, owner: string): Promise<any> {
    if (dto.text && dto.type === ITypeContent.PROFILE) {
      throw new BadRequestException('profile content dont needs text');
    }
    if (dto.type === ITypeContent.PROFILE && dto.contents.length > 1) {
      throw new BadRequestException(
        'profile content dont needs more than 1 content',
      );
    }
    if (dto.type === ITypeContent.PROFILE) {
      await this.contentRepositoru.deleteMany(owner, dto.type);
    }
    await this.contentRepositoru.create({
      ...dto,
      owner,
      comments: [],
      likersId: [],
      settings: {
        allowComments: true,
      },
    });
  }
}
