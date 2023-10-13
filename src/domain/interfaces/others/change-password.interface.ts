import { IValidationCodeType } from 'src/domain/entity/code.entity';

export interface IChangePasswordDto {
  tokenCode: string;
  newPassword: string;
  confirmNewPassword: string;
  type: IValidationCodeType;
}
