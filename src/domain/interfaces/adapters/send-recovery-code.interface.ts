import { IValidationCodeType } from 'src/domain/entity/code.entity';

export interface ISendRecoveryCode {
  send: (to: string, code: string, type: IValidationCodeType) => void;
}
