import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength, Matches } from 'class-validator';
import regex from '../../shared/helpers/regex';
import { IAuth } from '../../domain/interfaces/others/auth.interface';

export class Auth implements IAuth {
  @IsString()
  @ApiProperty({ required: true, example: 'email or phone here' })
  @Matches(regex.emailOrPhone, {
    message: 'email ou telefone com formato inválido',
  })
  emailOrPhone: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @ApiProperty({ required: true, example: 'vyppers@2024' })
  password: string;
}
