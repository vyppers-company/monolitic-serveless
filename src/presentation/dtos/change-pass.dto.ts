import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { IChangePasswordDto } from '../../domain/interfaces/others/change-password.interface';
import { Match } from '../../shared/decorators/match.decorator';
import regex from '../../shared/helpers/regex';

export class ChangePasswordDto implements IChangePasswordDto {
  @IsString()
  @ApiProperty({ required: true, example: 'token_here' })
  tokenCode: string;

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
