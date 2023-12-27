import { IInternalUser } from 'src/domain/entity/internal-users';
import { IProfile } from '../../entity/user.entity';
import { ILoggedInternalUser } from '../others/logged.interface';

export interface IRegisterUseCase {
  register: (dto: IProfile) => Promise<void>;
}

export interface IRegisterMinimalUseCase {
  registerMinimal: (
    dto: Pick<IProfile, 'password' | 'email' | 'phone' | 'termsAndConditions'>,
  ) => Promise<void>;
}

export interface IRegisterInternalUser {
  registerInternalUser: (
    dto: IInternalUser,
    userInternal: ILoggedInternalUser,
  ) => Promise<void>;
}
