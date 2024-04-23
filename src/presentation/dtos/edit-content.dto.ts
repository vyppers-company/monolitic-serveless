import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';
import { SingleProductOnContentDto } from './create-content.dto';
import { ISingleProductOnContent } from 'src/domain/interfaces/adapters/payment-product.interface';

export interface IEditContentDto {
  owner: string;
  text?: string;
  contentId: string;
  plans?: string[];
  productId?: string;
}
export interface IEditContentDtoExtended {
  owner: string;
  text?: string;
  contentId: string;
  plans?: string[];
  product?: Pick<
    ISingleProductOnContent,
    'activated' | 'benefits' | 'description' | 'limit' | 'price'
  >;
}

export class EditContentDto implements Pick<IEditContentDto, 'text' | 'plans'> {
  @IsString()
  @MaxLength(1024, { message: 'message is too large' })
  @ApiProperty({
    example: 'description_here',
    required: false,
  })
  @IsOptional()
  text?: string;
  @ApiProperty({
    examples: ['object_id_here1', 'object_id_here2'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  plans?: string[] | null;
  @ApiProperty({
    required: false,
    example: JSON.stringify({
      activated: true,
      benefits: ['beneficio 1', 'beneficio 2'],
      description: 'string',
      limit: 0,
      price: 100,
    }),
  })
  @IsOptional()
  product?: SingleProductOnContentDto;
}
