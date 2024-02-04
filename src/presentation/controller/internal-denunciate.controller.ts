import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { DenunciateInternalService } from 'src/domain/usecases/denunciate-internal.service';
import {
  InternalDenunciateDto,
  VerifyDenuncianteTicketDto,
} from '../dtos/internal-denunciante.dto';
import { InternalUserLogged } from 'src/shared/decorators/internal-user-logged';
import { ILoggedInternalUser } from 'src/domain/interfaces/others/logged.interface';

@Controller('internal-denunciate')
@ApiTags('internal-denunciate')
export class InternalDenunciateController {
  constructor(
    private readonly internalDenunciateService: DenunciateInternalService,
  ) {}

  @Get('v1/tickets')
  @ApiBearerAuth()
  async getAllTickets(
    @Query() filters: InternalDenunciateDto,
    @InternalUserLogged() user: ILoggedInternalUser,
  ) {
    return await this.internalDenunciateService.getTicketsToAnalise({
      ...filters,
      page: filters.page || 1,
      limit: filters.limit || 10,
    });
  }

  @Get('v1/ticket/:ticket')
  @ApiBearerAuth()
  async getOneTicket(
    @Param('ticket') ticket: string,
    @InternalUserLogged() _: ILoggedInternalUser,
  ) {
    return await this.internalDenunciateService.getTicketById(ticket);
  }

  @Post('v1/review/:ticket')
  @ApiBody({ type: VerifyDenuncianteTicketDto })
  @ApiBearerAuth()
  async reviewOne(
    @Param('ticket') ticket: string,
    @Body() dto: VerifyDenuncianteTicketDto,
    @InternalUserLogged() user: ILoggedInternalUser,
  ) {
    return await this.internalDenunciateService.verifyTicket({
      ...dto,
      ticketId: ticket,
      reviewerId: user._id,
    });
  }
}
