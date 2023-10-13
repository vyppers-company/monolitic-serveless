import { IValidationCodeType } from 'src/domain/entity/code.entity';

export interface ISendEmailAdapter {
  sendEmailCode: (
    to: string,
    code: string,
    type: IValidationCodeType,
  ) => Promise<void>;
}
