import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';
import { IProfile } from 'src/domain/entity/user.entity';
import regex from 'src/shared/helpers/regex';

export class ValidateArrobaDto implements Pick<IProfile, 'arroba'> {
  @IsString()
  @Matches(regex.arroba, {
    message: `O valor pode conter letras minúsculas (a-z).
  O valor pode começar com letras minúsculas (a-z).
  O valor pode começar com números (0-9).
  O valor pode conter números em qualquer posição.
  O valor pode conter os caracteres especiais '-', '_', e '.'.
  O valor pode conter combinações desses caracteres especiais e letras/números (por exemplo, "my-file_123").
  O valor pode começar com um caractere especial '_' apenas se for seguido por letras minúsculas ou números (por exemplo, "_mydata123").
  O valor não pode conter letras maiúsculas (A-Z).`,
  })
  @ApiProperty({
    required: true,
    example: 'paulorr.io igual de instagram',
    description: 'mandar sem @ no inicio',
  })
  arroba: string;
}

export class ValidateEmailDto implements Pick<IProfile, 'email'> {
  @IsEmail()
  @ApiProperty({ required: false, example: 'email valido aqui' })
  email?: string;
}

export class ValidatePhoneDto implements Pick<IProfile, 'phone'> {
  @IsString()
  @Matches(regex.celular, { message: 'invalid format phone' })
  @ApiProperty({ required: false, example: '13991987548' })
  phone?: string;
}
