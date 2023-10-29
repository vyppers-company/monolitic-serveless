import { Controller, Logger, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ILogged } from 'src/domain/interfaces/others/logged.interface';
import { FollowService } from 'src/domain/usecases/follow.service';
import { Logged } from 'src/shared/decorators/logged.decorator';

@Controller('followers')
@ApiTags('followers')
export class FollowersControllers {
  private logger: Logger;
  constructor(private readonly followersService: FollowService) {
    this.logger = new Logger();
  }

  @Put('v1/follow/:userId')
  @ApiOperation({
    description:
      'está rota assim como a de like, serve para seguir e parar de seguir, basta chamar a rota',
  })
  @ApiBearerAuth()
  async makeFollow(@Logged() user: ILogged, @Param('userId') userId: string) {
    await this.followersService.makeFollow(user._id, userId);
  }
}
