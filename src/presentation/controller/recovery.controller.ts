import { Body, Controller, Logger, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ChangePasswordService } from 'src/domain/usecases/change-password.service';
import { RecoveryService } from '../../domain/usecases/recovery.service';
import { ChangePasswordDto } from '../dtos/change-pass.dto';
import { Code, RecoveryDto, TokenCodeResponse } from '../dtos/recovery.dto';
import { ValidateCodeService } from 'src/domain/usecases/validate-code.service';
import { Logged } from 'src/shared/decorators/logged.decorator';
import { userInfo } from 'os';
import { ILogged } from 'src/domain/interfaces/others/logged.interface';
import { VapidNotificationService } from 'src/domain/usecases/vapidNotification.service';
import { SavePermissionVapid } from '../dtos/save-permission-vapid.dto';

@Controller('notification')
export class RecoveryController {
  private logger: Logger;
  constructor(
    private readonly recoveryService: RecoveryService,
    private readonly changePasswordService: ChangePasswordService,
    private readonly validateCodeService: ValidateCodeService,
    private readonly vapidNotificationService: VapidNotificationService,
  ) {
    this.logger = new Logger();
  }

  @ApiTags('notification')
  @Post('v1/code/send/recovery')
  async recoveryCode(@Body() dto: RecoveryDto) {
    return await this.recoveryService.send(dto);
  }
  @ApiTags('notification')
  @Post('v1/code/send/register')
  async registerCode(@Body() dto: RecoveryDto) {
    return await this.recoveryService.sendNaoLogado(dto);
  }

  @ApiTags('validation')
  @Post('v1/validate-code')
  async validateCode(@Body() dto: Code): Promise<TokenCodeResponse> {
    return await this.validateCodeService.validateCode(dto);
  }
  @ApiTags('recovery')
  @Post('v1/change-password')
  async changePassword(@Body() dto: ChangePasswordDto) {
    return await this.changePasswordService.change(dto);
  }
  @ApiTags('notification')
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
}
