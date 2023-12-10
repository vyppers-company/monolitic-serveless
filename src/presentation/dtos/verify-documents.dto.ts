import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumberString,
  IsDate,
  IsUrl,
} from 'class-validator';
import {
  IConfirmationData,
  IDocumentData,
  IVerificationStatus,
  IVerifyDocuments,
} from 'src/domain/entity/verify-documents';

export class ConfirmationDataDto implements IConfirmationData {
  @ApiProperty({ example: 'John Doe', description: 'Name of the person' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    example: '123456789',
    description: 'Numeric value of the document',
  })
  @IsNotEmpty({ message: 'Number cannot be empty' })
  @IsNumberString()
  number: string;

  @ApiProperty({
    example: '2023-12-31',
    description: 'Expiration date of the document',
  })
  @IsNotEmpty({ message: 'ExpiresIn cannot be empty' })
  @IsDate({ message: 'ExpiresIn must be a valid date' })
  expiresIn: string;

  @ApiProperty({
    example: 'ABC Organization',
    description: 'Name of the organization issuing the document',
  })
  @IsNotEmpty({ message: 'EmitterOrganization cannot be empty' })
  @IsString({ message: 'EmitterOrganization must be a string' })
  emitterOrganization: string;
}

export class VerifyDocumentsDto implements IDocumentData {
  @IsUrl()
  @ApiProperty({
    example: 'https://image-front.com',
  })
  front: string;
  @IsUrl()
  @ApiProperty({
    example: 'https://image-back.com',
  })
  back: string;
  @IsUrl()
  @ApiProperty({
    example: 'https://image-holding.com',
  })
  personHoldingDocument: string;
  @IsUrl()
  @ApiProperty({
    example: 'https://image-face.com',
  })
  justFace: string;
}

export class VerifyDocumentResponseDto implements IVerifyDocuments {
  @ApiProperty({
    type: ConfirmationDataDto,
    description: 'Confirmation data for the document',
  })
  @IsNotEmpty({ message: 'DocumentConfirmation cannot be empty' })
  documentConfirmation?: IConfirmationData;

  @ApiProperty({
    example: true,
    description: 'Flag indicating if the document is valid',
  })
  @IsNotEmpty({ message: 'isValid cannot be empty' })
  isValid: boolean;

  @ApiProperty({
    type: VerifyDocumentsDto,
    description: 'Confirmation data for the document',
  })
  @IsNotEmpty({ message: 'DocumentConfirmation cannot be empty' })
  documents: IDocumentData;

  @ApiProperty({
    example: '12345',
    description: 'Unique identifier for the document',
  })
  _id?: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the document owner',
  })
  @IsNotEmpty({ message: 'Owner cannot be empty' })
  @IsString({ message: 'Owner must be a string' })
  owner: string;

  @ApiProperty({
    example: 'Approval pending',
    description: 'Reason for the document status',
  })
  reason?: string;

  @ApiProperty({
    enum: ['WAITING', 'APPROVED', 'FAILED'],
    description: 'Status of the document verification',
  })
  @IsNotEmpty({ message: 'Status cannot be empty' })
  status: IVerificationStatus;
}
