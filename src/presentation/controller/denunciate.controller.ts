import { Body, Controller, Logger, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ILogged } from 'src/domain/interfaces/others/logged.interface';
import { DenunciateService } from 'src/domain/usecases/denunciate.service';
import { Logged } from 'src/shared/decorators/logged.decorator';
import { IDenuncianteDto } from '../dtos/denunciante.dto';

@ApiTags('denunciate')
@Controller('denunciate')
export class DenunciateController {
  private logger: Logger;
  constructor(private readonly denunciate: DenunciateService) {
    this.logger = new Logger(DenunciateController.name);
  }

  @Post('v1/send/:contentId')
  @ApiBearerAuth()
  async send(
    @Logged() user: ILogged,
    @Param('contentId') contentId: string,
    @Query() dto: IDenuncianteDto,
  ) {
    await this.denunciate.send(user._id, contentId, dto.reason);
  }
}
