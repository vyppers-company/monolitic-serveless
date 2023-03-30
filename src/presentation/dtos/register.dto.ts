import { Role } from '../../domain/interfaces/others/role.interface';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, Matches } from 'class-validator';
import regex from '../../shared/helpers/regex';
import { Match } from '../../shared/decorators/match.decorator';
import { IUserEntity } from '../../domain/entity/user.entity';

export class RegisterDto implements IUserEntity {
  @IsString()
  @ApiProperty({ required: true, example: 'Juliana' })
  name: string;

  @IsString()
  @ApiProperty({ required: true, example: '13996063278' })
  @Matches(regex.celular, { message: 'invalid phone number format' })
  phone: string;

  @IsString()
  @IsEmail()
  @ApiProperty({ required: true, example: 'email@email.com' })
  email: string;

  @IsString()
  @ApiProperty({ required: true, example: 'userPassword@2022' })
  @Matches(regex.senhaForte, {
    message: 'invalid minimum format  password',
  })
  password: string;

  @IsString()
  @Match('password')
  @ApiProperty({ required: true, example: 'userPassword@2022' })
  passwordConfirm: string;

  @IsEnum(Role)
  @ApiProperty({
    enum: ['CUSTOMER', 'PROFESSIONAL', 'EMPLOYES', 'ADMIN'],
    required: true,
  })
  role: Role;
}

export class RegisterDtoCandidates {}
