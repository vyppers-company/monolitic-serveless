import { IProfile } from 'src/domain/entity/user.entity';

export interface IProfileExt extends IProfile {
  bansQtd?: number;
  payedContents: number;
  freeContents: number;
  followersQtd: number;
  qtdLikes: number;
  paymentConfiguration?: any;
}

export interface IGetProfileUseCase {
  publicProfile: (
    vId: string,
  ) => Promise<
    Pick<
      IProfileExt,
      | 'bio'
      | '_id'
      | 'vypperId'
      | 'name'
      | 'profileImage'
      | 'interests'
      | 'planConfiguration'
      | 'caracteristics'
      | 'followersQtd'
      | 'freeContents'
      | 'payedContents'
      | 'qtdLikes'
    >
  >;
  getPersonalData: (
    userId: string,
    myId: string,
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
