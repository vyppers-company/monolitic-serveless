import { IQueriesSearchUser } from '../interfaces/usecases/search.interface';
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
}

export interface ICaracteristicas {
  gender?: ICategoryGender;
  hair?: ICategoryHair;
  ethnicity?: ICategoryEthnicity;
  eyes?: ICategoryEyes;
  biotype?: ICategoryBiotype;
}

export interface IPaymentConfig {
  paymentCustomerId: string;
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
  profileImage?: string;
  verified?: boolean;
  fitToReceivePayment?: boolean;
  paymentConfiguration?: IPaymentConfig;
  planConfiguration?: string[];
  birthday?: string;
  caracteristics?: ICaracteristicas;
  oauth2Partner?: string;
  termsAndConditions?: boolean;
  type?: ITYPEUSER;
  interests?: ICategory;
  bans?: string[];
  followers?: string[];
}
