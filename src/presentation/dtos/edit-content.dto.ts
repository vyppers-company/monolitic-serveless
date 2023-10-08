import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export interface IEditContentDto {
  owner: string;
  text: string;
  contentId: string;
}

export class EditContentDto implements Pick<IEditContentDto, 'text'> {
  @IsString()
  @MaxLength(1024, { message: 'message is too large' })
  @ApiProperty({
    example: 'description_here',
  })
  text: string;
}
