import { IUserEntity } from '../../entity/user.entity';

export interface IRegisterUseCase {
  register: (dto: IUserEntity) => Promise<void>;
}
