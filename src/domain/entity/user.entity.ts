export interface IAccess {
  _id?: string;
  name: string;
  password?: string;
  phone?: string;
  email?: string;
  profileId?: string;
  profileImage?: string;
  activated?: boolean;
  _idProfile?: string;
  birthday?: string;
  gender?: string;
  oauth2Partner?: string;
  termsAndConditions: boolean;
}
