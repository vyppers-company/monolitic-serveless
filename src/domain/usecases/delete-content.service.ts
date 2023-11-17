import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IDeleteContentUseCase } from '../interfaces/usecases/delete-content.interface';
import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { IDeleteContentDto } from 'src/presentation/dtos/delete-content.dto';
import { S3Service } from './s3-upload.service';

@Injectable()
export class DeleteContentService implements IDeleteContentUseCase {
  constructor(
    private readonly contentRepository: ContentRepository,
    private readonly s3: S3Service,
  ) {}
  async deleteContent(dto: IDeleteContentDto): Promise<void> {
    const content = await this.contentRepository.findOne({
      _id: dto.contentId,
    });
    if (content.owner !== dto.ownerId) {
      throw new HttpException(
        {
          message: 'this content doesnt belongs to this user',
          reason: 'ContentError',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.contentRepository.deleteById(dto.contentId);
    await this.s3.deleteObject(content.contents);
  }
}
