import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDefined,
  IsOptional,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UploadDeleteContentDto {
  @ApiProperty()
  @IsUrl()
  @IsOptional()
  blockedThumb?: string;
  @IsUrl()
  @ApiProperty()
  content: string;
  @IsUrl()
  @ApiProperty()
  @IsOptional()
  preview?: string;
  @ApiProperty()
  @IsOptional()
  @IsUrl()
  shortContent?: string;
  @ApiProperty()
  @IsUrl()
  @IsOptional()
  thumb?: string;
}

export class DeleteUpload {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UploadDeleteContentDto)
  @ApiProperty({
    example: JSON.stringify([
      {
        thumb: 'string',
        blockedThumb: 'string',
        content: 'string',
        preview: 'string',
        shortContent: 'string',
      },
    ]),
  })
  @IsDefined()
  contents?: UploadDeleteContentDto[];
}
