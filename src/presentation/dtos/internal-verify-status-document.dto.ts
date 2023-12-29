import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  IConfirmationData,
  IVerificationStatusEnum,
} from 'src/domain/entity/verify-documents';
import { IInternalUpdateStatusDocumentDto } from 'src/domain/interfaces/others/internal-update-status-document.dto';

export class IConfirmationDataDto implements IConfirmationData {
  @IsString()
  @ApiProperty({ required: true })
  emitterOrganization: string;
  @IsString()
  @ApiProperty({ required: true })
  expiresIn: string;
  @IsString()
  @ApiProperty({ required: true })
  name: string;
  @IsString()
  @ApiProperty({ required: true })
  number: string;
}

export class InternalUpdateStatusDocumentDto
  implements IInternalUpdateStatusDocumentDto
{
  @IsString()
  @ApiProperty({ required: true, description: 'id of card to verify' })
  cardId: string;
  @IsEnum(IVerificationStatusEnum, {
    each: true,
    message: 'Invalid type. Please provide one of the following values',
  })
  @ApiProperty({ enum: IVerificationStatusEnum })
  newStatus: IVerificationStatusEnum;
  @IsString()
  @ApiProperty({ required: true, description: 'id of user to verify' })
  userId: string;
  @ApiProperty({
    required: true,
    example: JSON.stringify({
      emitterOrganization: 'string',
      expiresIn: 'string',
      name: 'string',
      number: 'string',
    }),
  })
  @IsOptional()
  documentConfirmation: IConfirmationDataDto;
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: 'id of user to verify' })
  reason?: string;
}
