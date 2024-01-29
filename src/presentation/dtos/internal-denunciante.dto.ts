import {
  IDenuncianteReasons,
  IStatusDenunciate,
} from 'src/domain/entity/denunciate';
import {
  IDenunciateQueryDto,
  IVerifyDenuncianteTicketDto,
} from 'src/domain/interfaces/usecases/denunciate-internal.interface';
import {
  IsBoolean,
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
export class InternalDenunciateDto implements IDenunciateQueryDto {
  @IsString()
  @ApiProperty({ required: false })
  @IsOptional()
  document?: string;
  @IsOptional()
  @IsISO8601()
  @ApiProperty({ required: false })
  endDate?: Date;
  @IsNumber()
  @Transform(({ value }) => (parseFloat(value) ? parseFloat(value) : 10))
  @ApiProperty({
    required: false,
    example: 10,
    type: Number,
  })
  @IsOptional()
  limit?: number;
  @IsNumber()
  @Transform(({ value }) => (parseFloat(value) ? parseFloat(value) : 1))
  @ApiProperty({
    required: false,
    example: 10,
    type: Number,
  })
  @IsOptional()
  page?: number;
  @IsOptional()
  @IsEnum(IDenuncianteReasons)
  @ApiProperty({ enum: IDenuncianteReasons, required: false })
  reason?: IDenuncianteReasons;
  @IsISO8601()
  @IsOptional()
  @ApiProperty({ required: false })
  startDate?: Date;
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  vypperId?: string;
  @IsOptional()
  @IsEnum(IStatusDenunciate)
  @ApiProperty({ enum: IStatusDenunciate, required: false })
  status?: IStatusDenunciate;
}

export class VerifyDenuncianteTicketDto implements IVerifyDenuncianteTicketDto {
  @IsString()
  @ApiProperty({ required: true })
  decisionReason: string;
  @IsBoolean()
  @ApiProperty({ required: true })
  decisionToBanUser: boolean;
  @IsBoolean()
  @ApiProperty({ required: true })
  excludeContent: boolean;
}
