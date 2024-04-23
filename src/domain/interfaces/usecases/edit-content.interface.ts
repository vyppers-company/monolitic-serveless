import { IEditContentDtoExtended } from 'src/presentation/dtos/edit-content.dto';

export interface IEditContentUseCase {
  editContent: (dto: IEditContentDtoExtended) => Promise<void>;
}
