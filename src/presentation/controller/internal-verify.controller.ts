import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IVerificationStatusEnum } from 'src/domain/entity/verify-documents';
import { ILoggedInternalUser } from 'src/domain/interfaces/others/logged.interface';
import { VerifyDocumentsInternalService } from 'src/domain/usecases/verify-documents-internal.service';

import { InternalUserLogged } from 'src/shared/decorators/internal-user-logged';
import { InternalUpdateStatusDocumentDto } from '../dtos/internal-verify-status-document.dto';

@ApiTags('verify-documents-internal')
@Controller('internal-verify-documents')
export class VerifyDocumentsInternalController {
  constructor(
    private readonly verifyDocumentsService: VerifyDocumentsInternalService,
  ) {}

  @Put('v1/update-status')
  @ApiBearerAuth()
  @ApiBody({ type: InternalUpdateStatusDocumentDto })
  async updateStatus(
    @InternalUserLogged() user: ILoggedInternalUser,
    @Body() dto: InternalUpdateStatusDocumentDto,
  ) {
    await this.verifyDocumentsService.updateStatus(user._id, dto);
  }

  @Get('v1/to-verify')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'return only by status',
    enum: IVerificationStatusEnum,
  })
  @ApiQuery({
    name: 'cardId',
    required: false,
    description: 'return only by cardid',
  })
  async getAllByStatus(
    @InternalUserLogged() _: ILoggedInternalUser,
    @Query('status') status: IVerificationStatusEnum,
    @Query('cardId') cardId?: string,
  ) {
    if (!!status && !!cardId) {
      throw new HttpException(
        'only one query param per time is allowed',
        HttpStatus.CONFLICT,
      );
    }
    return await this.verifyDocumentsService.getTicketsToVerify(status, cardId);
  }
}
