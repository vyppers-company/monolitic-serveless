import { IValidationCodeType } from 'src/domain/entity/code.entity';

export interface ISendEmailAdapter {
  sendEmailCode: (
    to: string,
    code: string,
    type: IValidationCodeType,
  ) => Promise<void>;
  sendEmail: (to: string, title: string, template: string) => Promise<void>;
}
