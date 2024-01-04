import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { IDenuncianteReasons } from 'src/domain/entity/denunciate';

export class IDenuncianteDto {
  @ApiProperty({
    enum: IDenuncianteReasons,
    example: IDenuncianteReasons.ASSEDIO,
    required: true,
  })
  @IsEnum(IDenuncianteReasons)
  reason: IDenuncianteReasons;
}
