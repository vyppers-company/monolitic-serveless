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
  @ApiProperty({ required: false })
  @IsOptional()
  blockedThumb?: string;
  @ApiProperty()
  content: string;
  @ApiProperty({ required: false })
  @IsOptional()
  preview?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  shortContent?: string;
  @ApiProperty({ required: false })
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
      },
    ]),
  })
  @IsDefined()
  contents?: UploadDeleteContentDto[];
}
