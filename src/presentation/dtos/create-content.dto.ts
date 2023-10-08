import { IsArray, IsEnum, isURL, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IContentEntity, ITypeContent } from 'src/domain/entity/contents';

export class CreateContentDto implements IContentEntity {
  @IsEnum(ITypeContent, {
    each: true,
    message: 'Invalid status. Please provide one of the following values',
  })
  @ApiProperty({ examples: ITypeContent })
  type: ITypeContent;

  @IsArray()
  @Validate(
    (object: Record<string, any>) => {
      const { contents, text, type } = object;

      if (type === ITypeContent.PROFILE && text) {
        return { message: 'profile dont need text' };
      }

      if (
        type === ITypeContent.PROFILE &&
        (!contents || contents.length === 0)
      ) {
        return { message: 'profile needs content' };
      }

      if (type === ITypeContent.PROFILE && (contents || contents.length > 1)) {
        return { message: 'profile needs just one content' };
      }

      if (
        (!contents || contents.length === 0) &&
        (!text || text.length === 0)
      ) {
        return false; // Nenhum deles está preenchido
      }

      if (contents) {
        for (const url of contents) {
          if (!isURL(url)) {
            return false;
          }
        }
      }

      return true;
    },
    { message: 'At least one of contents or text must be provided' },
  )
  @ApiProperty({
    examples: ['https://image_url.com/image1', 'https://image_url.com/video'],
    required: false,
  })
  contents?: string[];

  @ApiProperty({
    example: 'description_here',
    required: false,
  })
  text?: string;
}
