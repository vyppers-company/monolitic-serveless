import { IProfile } from '../../entity/user.entity';

export interface IRegisterUseCase {
  register: (dto: IProfile) => Promise<void>;
}

export interface IRegisterMinimalUseCase {
  registerMinimal: (
    dto: Pick<IProfile, 'password' | 'email' | 'phone' | 'termsAndConditions'>,
  ) => Promise<void>;
}
