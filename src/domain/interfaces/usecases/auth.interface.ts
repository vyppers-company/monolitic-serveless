import { IAccess } from 'src/domain/entity/user.entity';
import { IAuth } from '../others/auth.interface';

export interface IAuthUseCase {
  auth: (dto: IAuth) => Promise<{ token: string } | Error>;
  loginOauth20: (dto: IAccess) => Promise<{ token: string } | Error>;
}
