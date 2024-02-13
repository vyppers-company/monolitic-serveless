import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { CreateContentDto } from 'src/presentation/dtos/create-content.dto';
import { ICreateContentUseCase } from '../interfaces/usecases/create-content.interface';
import { AuthorizedTypesMidia, ITypeContent } from '../entity/contents';
import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import {
  authorizedImages,
  authorizedVideos,
} from '../interfaces/adapters/s3.adapter';

@Injectable()
export class CreateContentService implements ICreateContentUseCase {
  constructor(
    private readonly contentRepositoru: ContentRepository,
    private readonly userrepo: UserRepository,
  ) {}
  async create(dto: CreateContentDto, owner: string): Promise<any> {
    if (
      dto.plans.length &&
      dto.contents.length % 2 === 1 &&
      dto.type !== ITypeContent.PROFILE
    ) {
      throw new HttpException(
        {
          message: 'if the content is payed, is required to send payed',
          reason: 'ContentError',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (dto.plans.length && dto.type === ITypeContent.PROFILE) {
      throw new HttpException(
        {
          message: 'profile image dont need to be payed',
          reason: 'ContentError',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!dto.contents.length && !dto.text) {
      throw new HttpException(
        {
          message: 'at least text or content is required',
          reason: 'ContentError',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (dto.text && dto.type === ITypeContent.PROFILE) {
      throw new HttpException(
        {
          message: 'profile content dont needs text',
          reason: 'ContentError',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (dto.type === ITypeContent.PROFILE && dto.contents.length > 1) {
      throw new HttpException(
        {
          message: 'profile content dont needs more than 1 content',
          reason: 'ContentError',
        },
        HttpStatus.BAD_REQUEST,
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
    dto.contents.forEach((content) => {
      if (
        !authorizedImages.includes(content.extension) &&
        !authorizedVideos.includes(content.extension)
      ) {
        throw new HttpException('format not allowed', HttpStatus.FORBIDDEN);
      }
    });

    const data = await this.contentRepositoru.create({
      ...dto,
      plans: dto.plans || [],
      owner,
    });
    if (dto.type === ITypeContent.PROFILE) {
      await this.userrepo.updateProfileImage(owner, String(data._id));
    }
  }
}
