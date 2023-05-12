import { IUserEntity } from 'src/domain/entity/user.entity';
import { ILogged } from '../others/logged.interface';

export interface IUserService {
  getPersonalData: (
    logged: ILogged,
  ) => Promise<Pick<IUserEntity, 'email' | 'phone' | 'role'>>;
}
