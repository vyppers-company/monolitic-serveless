import { IProfile } from 'src/domain/entity/user.entity';
import { ILogged } from '../../interfaces/others/logged.interface';

export interface IProfileExt extends IProfile {
  bansQtd: number;
  payedContents: number;
  freeContents: number;
  followersQtd: number;
  qtdLikes: number;
  paymentConfiguration: any;
}

export interface IGetProfileUseCase {
  getPersonalData: (
    logged: ILogged,
  ) => Promise<
    Pick<
      IProfileExt,
      | 'bio'
      | '_id'
      | 'vypperId'
      | 'name'
      | 'profileImage'
      | 'birthday'
      | 'email'
      | 'phone'
      | 'interests'
      | 'paymentConfiguration'
      | 'planConfiguration'
      | 'caracteristics'
      | 'bansQtd'
      | 'followersQtd'
      | 'freeContents'
      | 'payedContents'
      | 'qtdLikes'
    >
  >;
}
