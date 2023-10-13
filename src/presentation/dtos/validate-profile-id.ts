import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IValidateArroba } from 'src/domain/interfaces/others/validate-profile-id.interface';

export class ArrobaDto implements IValidateArroba {
  @IsString()
  @ApiProperty({
    required: true,
    example: '@paulorr.io igual de instagram',
    description: 'mandar sem @ no inicio',
  })
  arroba: string;
}
