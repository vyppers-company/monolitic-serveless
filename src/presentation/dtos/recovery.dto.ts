import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';
import {
  ICode,
  IRecoveryDto,
  ITokenCode,
} from '../../domain/interfaces/others/recovery.interface';
import regex from '../../shared/helpers/regex';

export class RecoveryDto implements IRecoveryDto {
  @IsString()
  @ApiProperty({ required: true, example: 'email or phone here' })
  @Matches(regex.emailOrPhone, {
    message: 'email ou telefone com formato inválido',
  })
  emailOrPhone: string;
}

export class Code implements ICode {
  @IsString()
  @Length(6, 6)
  @ApiProperty({ required: true, example: '123456' })
  code: string;
}

export class TokenCodeResponse implements ITokenCode {
  @IsString()
  @ApiProperty({ required: true, example: 'token_here' })
  tokenCode: string;
}
