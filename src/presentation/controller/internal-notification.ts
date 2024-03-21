import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ILoggedInternalUser } from 'src/domain/interfaces/others/logged.interface';
import { InternalUserLogged } from 'src/shared/decorators/internal-user-logged';
import { CreateCampaignInternalDto } from '../dtos/internal-notification';
import { InternalServiceNotification } from 'src/domain/usecases/internal-notification.service';

@Controller('internal-notification')
@ApiTags('internal-notification')
export class InternalControllerNotification {
  constructor(
    private readonly internalServiceNotification: InternalServiceNotification,
  ) {}
  @Post('v1/create-campaign')
  @ApiBearerAuth()
  @ApiBody({ type: CreateCampaignInternalDto })
  async createCampaign(
    @Body() body: CreateCampaignInternalDto,
    @InternalUserLogged() userLogged: ILoggedInternalUser,
  ) {
    await this.internalServiceNotification.createCampaign(body, userLogged);
  }
}
