import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsString, Matches, Max } from 'class-validator';
import { IGender, IProfile } from 'src/domain/entity/user.entity';
import regex from 'src/shared/helpers/regex';

export class ProfileDto implements IProfile {
  @IsString()
  @ApiProperty({ required: false, example: 'Isadora Vale' })
  name?: string;
  @IsString()
  @Matches(regex.celular, { message: 'invalid format phone' })
  @ApiProperty({ required: false, example: '13991987548' })
  phone?: string;
  @IsString()
  @Max(256)
  @ApiProperty({ required: false, example: 'visite meu perfil' })
  bio?: string;
  @IsString()
  @ApiProperty({ required: false, example: '@isadoravale' })
  arroba?: string;
  @IsISO8601()
  @ApiProperty({ required: false, example: '1991-01-01T00:00:00.000Z' })
  birthday?: string;
  @IsString()
  @ApiProperty({ required: false, enum: IGender, example: IGender.F })
  gender?: IGender;
}
