import { BadRequestException, Injectable } from '@nestjs/common';
import { IDeleteContentUseCase } from '../interfaces/usecases/delete-content.interface';
import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { IDeleteContentDto } from 'src/presentation/dtos/delete-content.dto';

@Injectable()
export class DeleteContentService implements IDeleteContentUseCase {
  constructor(private readonly contentRepository: ContentRepository) {}
  async deleteContent(dto: IDeleteContentDto): Promise<void> {
    const content = await this.contentRepository.findOne({
      _id: dto.contentId,
    });
    if (content.owner !== dto.ownerId) {
      throw new BadRequestException('this content doesnt belongs to this user');
    }
    await this.contentRepository.deleteById(dto.contentId);
  }
}
