import { IDeleteContentDto } from './delete-content.dto';

export interface IDeleteContentUseCase {
  deleteContent: (dto: IDeleteContentDto) => Promise<void>;
}
