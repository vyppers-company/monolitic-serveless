import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthGoogleDto {
  @IsString()
  @ApiProperty({ required: true })
  accessToken: string;
}
