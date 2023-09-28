import { IAccess } from '../../entity/user.entity';

export interface IRegisterUseCase {
  register: (dto: IAccess) => Promise<void>;
}
