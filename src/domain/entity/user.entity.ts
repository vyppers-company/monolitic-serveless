export enum ITYPEUSER {
  USER = 'USER',
  BOT = 'BOT',
  ADMIN = 'ADMIN',
  CREATOR = 'CREATOR',
}

export enum IGender {
  M = 'M',
  F = 'F',
  NON_BINARY = 'NON_BINARY',
  TRANS = 'TRANS',
  OTHER = 'OTHER',
}

export interface IProfile {
  _id?: string;
  name?: string;
  password?: string;
  phone?: string;
  bio?: string;
  email?: string;
  arroba?: string;
  profileImage?: string;
  activated?: boolean;
  fitToReceivePayment?: boolean;
  paymentConfiguration?: string;
  planConfiguration?: string;
  birthday?: string;
  gender?: IGender;
  oauth2Partner?: string;
  termsAndConditions?: boolean;
  type?: ITYPEUSER;
  interests?: string[];
}
