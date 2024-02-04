import {
  ICategory,
  ICategoryBiotype,
  ICategoryEthnicity,
  ICategoryEyes,
  ICategoryGender,
  ICategoryHair,
} from './category';

export enum ITYPEUSER {
  USER = 'USER',
  BOT = 'BOT',
  ADMIN = 'ADMIN',
  CREATOR = 'CREATOR',
  EMPLOYEE = 'EMPLOYEE',
  TESTER = 'TESTER',
}

export interface ICaracteristicas {
  gender?: ICategoryGender;
  hair?: ICategoryHair;
  ethnicity?: ICategoryEthnicity;
  eyes?: ICategoryEyes;
  biotype?: ICategoryBiotype;
}

export interface IProfile {
  _id?: string;
  name?: string;
  password?: string;
  cpf?: string;
  phone?: string;
  bio?: string;
  email?: string;
  vypperId?: string;
  verified?: boolean;
  fitToReceivePayment?: boolean;
  profileImage?: string;
  paymentConfiguration?: string;
  planConfiguration?: string[];
  birthday?: string;
  caracteristics?: ICaracteristicas;
  oauth2Partner?: string;
  termsAndConditions?: boolean;
  type?: ITYPEUSER;
  interests?: ICategory;
  bans?: string[];
  followers?: string[];
  isBanned?: boolean;
  isFreezed?: boolean;
}
