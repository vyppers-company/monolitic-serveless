import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VerifyDocumentsService } from 'src/domain/usecases/verify-documents.service';
import { Logged } from 'src/shared/decorators/logged.decorator';
import { ILogged } from 'src/domain/interfaces/others/logged.interface';
import {
  VerifyDocumentResponseDto,
  VerifyDocumentsDto,
} from '../dtos/verify-documents.dto';

@ApiTags('verify-documents')
@Controller('verify-documents')
export class VerifyDocumentsController {
  constructor(
    private readonly verifyDocumentsService: VerifyDocumentsService,
  ) {}

  @Post('v1/submit')
  @ApiBearerAuth()
  @ApiBody({
    description: 'verify documents',
    type: VerifyDocumentsDto,
  })
  async submitValidation(
    @Logged() user: ILogged,
    @Body() dto: VerifyDocumentsDto,
  ) {
    await this.verifyDocumentsService.submit(dto, user._id);
  }

  @Get('v1/status')
  @ApiBearerAuth()
  @ApiResponse({
    description: 'schema de retorno',
    type: VerifyDocumentResponseDto,
  })
  async getStatus(@Logged() user: ILogged) {
    return await this.verifyDocumentsService.getStatus(user._id);
  }
}
