import { CreateContentDto } from './create-content.dto';

export interface ICreateContentUseCase {
  create: (dto: CreateContentDto, owner: string) => Promise<any>;
}
