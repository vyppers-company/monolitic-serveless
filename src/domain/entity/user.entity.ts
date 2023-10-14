export enum ITYPEUSER {
  USER = 'USER',
  BOT = 'BOT',
  ADMIN = 'ADMIN',
  CREATOR = 'CREATOR',
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
  birthday?: string;
  gender?: string;
  oauth2Partner?: string;
  termsAndConditions?: boolean;
  type?: ITYPEUSER;
}
