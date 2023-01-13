import { Role } from '../../domain/interfaces/role.interface';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import regexBase from '../../shared/helpers/regex';
import { Match } from '../../shared/decorators/match.decorator';

export class RegisterDto {
  @IsString()
  @ApiProperty({ required: true, example: 'Juliana' })
  name: string;

  @IsString()
  @MinLength(10)
  @MaxLength(11)
  @ApiProperty({ required: true, example: '13996063278' })
  @Matches(regexBase.senhaForte, { message: 'invalid phone number format' })
  phone: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @ApiProperty({ required: true, example: 'userPassword@2022' })
  @Matches(regexBase.senhaForte, {
    message: 'invalid minimum format  password',
  })
  password: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Match('password')
  @ApiProperty({ required: true, example: 'userPassword@2022' })
  passwordConfirm: string;

  @IsEnum(Role)
  @ApiProperty({
    enum: ['CUSTOMER', 'PROFESSIONAL', 'EMPLOYES', 'ADMIN'],
  })
  role: Role;
}

export class RegisterDtoCandidates {}
