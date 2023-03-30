import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { IRecoveryDto } from '../../domain/interfaces/others/recovery.interface';
import regex from '../../shared/helpers/regex';

export class RecoveryDto implements IRecoveryDto {
  @IsString()
  @ApiProperty({ required: true, example: 'email or phone here' })
  @Matches(regex.emailOrPhone, {
    message: 'email ou telefone com formato inválido',
  })
  emailOrPhone: string;
}
