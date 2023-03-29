import { Role } from '../../domain/interfaces/others/role.interface';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, Matches } from 'class-validator';
import regexBase from '../../shared/helpers/regex';
import { Match } from '../../shared/decorators/match.decorator';
import { IUserEntity } from 'src/domain/entity/user.entity';

export class RegisterDto implements IUserEntity {
  @IsString()
  @ApiProperty({ required: true, example: 'Juliana' })
  name: string;

  @IsString()
  @ApiProperty({ required: true, example: '13996063278' })
  @Matches(regexBase.celular, { message: 'invalid phone number format' })
  phone: string;

  @IsString()
  @IsEmail()
  @ApiProperty({ required: true, example: 'email@email.com' })
  email: string;

  @IsString()
  @ApiProperty({ required: true, example: 'userPassword@2022' })
  @Matches(regexBase.senhaForte, {
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
