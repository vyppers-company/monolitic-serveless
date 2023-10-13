import { IValidationCodeType } from 'src/domain/entity/code.entity';

export interface IRecoveryDto {
  emailOrPhone: string;
}

export interface ITokenCode {
  tokenCode: string;
}

export interface ICode {
  code: string;
}
