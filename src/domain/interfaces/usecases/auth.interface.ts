import { IProfile } from 'src/domain/entity/user.entity';
import { IAuth } from '../others/auth.interface';

export interface IAuthUseCase {
  auth: (dto: IAuth) => Promise<{ token: string } | Error>;
  loginOauth20: (
    dto: IProfile,
  ) => Promise<{ token: string; info: any } | Error>;
}
