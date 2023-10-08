import { CreateContentDto } from 'src/presentation/dtos/create-content.dto';

export interface ICreateContentUseCase {
  create: (dto: CreateContentDto, owner: string) => Promise<any>;
}
