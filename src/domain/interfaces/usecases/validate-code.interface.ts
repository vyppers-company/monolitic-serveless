import { ICode, ITokenCode } from '../others/recovery.interface';

export interface IValidateCode {
  validateCode: (dto: ICode) => Promise<ITokenCode>;
}
