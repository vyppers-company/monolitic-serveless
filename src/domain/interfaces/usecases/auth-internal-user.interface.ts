import { IAuthInternalUser } from '../others/auth-internal.interface';

export interface IAuthInternalUserUseCase {
  authInternal: (dto: IAuthInternalUser) => Promise<{ token: string } | Error>;
}
