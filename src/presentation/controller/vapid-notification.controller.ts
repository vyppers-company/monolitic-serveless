import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Logged } from 'src/shared/decorators/logged.decorator';
import { ILogged } from 'src/domain/interfaces/others/logged.interface';
import { SavePermissionVapid } from '../dtos/save-permission-vapid.dto';
import { VapidNotificationService } from 'src/domain/usecases/vapid-notification.service';
import { NotificationConfigDto } from '../dtos/config-vapid-notification.dto';
import { ITypeNotification } from 'src/domain/interfaces/usecases/vapid-notification.interface';

@Controller('vapid-notification')
@ApiTags('vapid-notification')
export class VapidNotificationController {
  constructor(
    private readonly vapidNotificationService: VapidNotificationService,
  ) {}

  @Patch('v1/permission/browser')
  @ApiBearerAuth()
  @ApiBody({ type: SavePermissionVapid })
  async savePermissionToSendNotificationByBrowser(
    @Body() dto: SavePermissionVapid,
    @Logged() user: ILogged,
  ) {
    return await this.vapidNotificationService.savePermissionNotificationBrowser(
      dto,
      user._id,
    );
  }

  @Get('v1/notifications')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'quantidade que deseja buscar. valor padrao 10',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'numero da pagina que deseja buscar. valo padrao 1',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'quantidade que deseja buscar. valor padrao 10',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    example: ['all', 'only_read', 'only_unread'],
    enum: ITypeNotification,
    description: 'tipo da notificacao',
  })
  async getUnreadNotifications(
    @Logged() user: ILogged,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
    @Query('type') type?: ITypeNotification,
  ) {
    return this.vapidNotificationService.getUnread(user._id, {
      limit,
      page,
      type,
    });
  }

  @Put('v1/mark/viewed/:notificationId')
  @ApiBearerAuth()
  async markAsViewed(
    @Logged() user: ILogged,
    @Param('notificationId') notificationId: string,
  ) {
    await this.vapidNotificationService.markAsViewed(user._id, notificationId);
  }

  @Put('v1/config/notification')
  @ApiBearerAuth()
  @ApiBody({ type: NotificationConfigDto })
  async configNotification(
    @Logged() user: ILogged,
    @Body() dto: NotificationConfigDto,
  ) {
    await this.vapidNotificationService.setConfiguration(user._id, dto);
  }
}
