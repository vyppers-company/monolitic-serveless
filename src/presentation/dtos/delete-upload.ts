import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class DeleteUpload {
  @IsUrl({}, { each: true })
  @ApiProperty({ required: true, example: ['photo url here'] })
  urls: string[];
}
