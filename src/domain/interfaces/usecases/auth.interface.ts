import { IAuth } from '../others/auth.interface';

export interface IAuthUseCase {
  auth: (dto: IAuth) => Promise<{ token: string } | Error>;
}
