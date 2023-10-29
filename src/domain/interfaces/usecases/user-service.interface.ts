import { IProfile } from 'src/domain/entity/user.entity';
import { ILogged } from '../../interfaces/others/logged.interface';

export interface IGetProfileUseCase {
  getPersonalData: (
    logged: ILogged,
  ) => Promise<
    Pick<
      IProfile,
      | 'bio'
      | '_id'
      | 'vypperID'
      | 'name'
      | 'profileImage'
      | 'birthday'
      | 'email'
      | 'phone'
      | 'interests'
      | 'paymentConfiguration'
      | 'planConfiguration'
      | 'caracteristics'
    >
  >;
}
