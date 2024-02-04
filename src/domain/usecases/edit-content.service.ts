import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { IEditContentUseCase } from '../interfaces/usecases/edit-content.interface';
import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { IEditContentDto } from 'src/presentation/dtos/edit-content.dto';

@Injectable()
export class EditContentService implements IEditContentUseCase {
  constructor(private readonly contentRepository: ContentRepository) {}
  async editContent(dto: IEditContentDto): Promise<void> {
    const content = await this.contentRepository.findOne({
      _id: dto.contentId,
      owner: dto.owner,
      isDeleted: false,
    });
    if (!content) {
      throw new HttpException(
        {
          message: 'Not found content',
          reason: 'ContentError',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.contentRepository.updateOne(dto);
  }
}
