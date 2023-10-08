import { IEditContentDto } from 'src/presentation/dtos/edit-content.dto';

export interface IEditContentUseCase {
  editContent: (dto: IEditContentDto) => Promise<void>;
}
