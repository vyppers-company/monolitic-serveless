import { IDeleteContentDto } from 'src/presentation/dtos/delete-content.dto';

export interface IDeleteContentUseCase {
  deleteContent: (dto: IDeleteContentDto) => Promise<void>;
}
