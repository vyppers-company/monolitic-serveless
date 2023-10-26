export enum IValidationCodeType {
  REGISTER = 'REGISTER',
  RECOVERY = 'RECOVERY',
  CHANGE_PHONE = 'CHANGE_PHONE',
  REMOVE_PHONE = 'REMOVE_PHONE',
  CHANGE_EMAIL = 'CHANGE_EMAIL',
  REMOVE_EMAIL = 'REMOVE_EMAIL',
}
export interface ICodeEntity {
  _id?: string;
  owner: string;
  code: string;
  expiresIn: number;
  used?: boolean;
  type?: IValidationCodeType;
}
