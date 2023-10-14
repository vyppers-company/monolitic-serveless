import { NotFoundException, Injectable } from '@nestjs/common';
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
    });
    if (!content) {
      throw new NotFoundException();
    }
    this.contentRepository.updateOne(dto).then();
  }
}
