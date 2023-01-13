import { IBffMsRegisterEntity } from '../../entity/register.entity';

export interface IRegisterUseCase {
  register: (dto: IBffMsRegisterEntity) => Promise<void>;
}
