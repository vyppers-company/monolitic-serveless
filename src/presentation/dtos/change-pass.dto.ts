import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';
import { IChangePasswordDto } from '../../domain/interfaces/others/change-password.interface';
import { Match } from '../../shared/decorators/match.decorator';
import regex from '../../shared/helpers/regex';

export class ChangePasswordDto implements IChangePasswordDto {
  @IsString()
  @Length(6, 6)
  @ApiProperty({ required: true, example: '123456' })
  code: string;

  @IsString()
  @ApiProperty({ required: true, example: 'email or phone here' })
  @Matches(regex.emailOrPhone, {
    message: 'email ou telefone com formato inválido',
  })
  emailOrPhone: string;

  @IsString()
  @ApiProperty({ required: true, example: 'userPassword@2022' })
  @Matches(regex.senhaForte, {
    message: 'invalid minimum format  password',
  })
  newPassword: string;

  @IsString()
  @Match('newPassword')
  @ApiProperty({ required: true, example: 'userPassword@2022' })
  confirmNewPassword: string;
}
