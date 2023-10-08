import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class DeleteUpload {
  @IsUrl()
  @ApiProperty({ required: true, example: 'photo url here' })
  url: string;
}
