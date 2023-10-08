import { IEditContentDto } from './edit.dto';

export interface IEditContentUseCase {
  editContent: (dto: IEditContentDto) => Promise<void>;
}
