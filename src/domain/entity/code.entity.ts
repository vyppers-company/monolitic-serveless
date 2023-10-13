export enum IValidationCodeType {
  REGISTER = 'REGISTER',
  RECOVERY = 'RECOVERY',
}
export interface ICodeEntity {
  _id?: string;
  owner: string;
  code: string;
  expiresIn: number;
  used?: boolean;
  type?: IValidationCodeType;
}
