export enum ITYPEUSER {
  REAL = 'REAL',
  BOT = 'BOT',
  ADMIN = 'ADMIN',
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
