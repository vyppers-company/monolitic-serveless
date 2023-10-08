import { IProfile } from '../../entity/user.entity';

export interface IRegisterUseCase {
  register: (dto: IProfile) => Promise<void>;
}
