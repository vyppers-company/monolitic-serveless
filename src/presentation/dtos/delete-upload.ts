import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUrl, ValidateNested } from 'class-validator';
import { UploadContentDto } from './create-content.dto';
import { Type } from 'class-transformer';

export class DeleteUpload {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UploadContentDto)
  @ApiProperty({
    example: JSON.stringify([
      {
        type: 'string',
        thumb: 'string',
        blockedThumb: 'string',
        content: 'string',
        preview: 'string',
        shortContent: 'string',
      },
    ]),
  })
  contents?: UploadContentDto[];
}
