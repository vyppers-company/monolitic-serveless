import {
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ILogged } from 'src/domain/interfaces/others/logged.interface';
import { BanUserService } from 'src/domain/usecases/ban-user.service';
import { Logged } from 'src/shared/decorators/logged.decorator';

@Controller('ban')
@ApiTags('Banned Users')
export class BanUserController {
  constructor(private readonly banService: BanUserService) {}

  @Post('v1/:userId')
  @ApiBearerAuth()
  async banUser(@Logged() user: ILogged, @Param('userId') userId: string) {
    await this.banService.banUser(userId, user._id);
  }

  @Delete('v1/:userId')
  @ApiBearerAuth()
  async unbanUser(@Logged() user: ILogged, @Param('userId') userId: string) {
    await this.banService.unbanUser(userId, user._id);
  }

  @Get('v1/my-banned-users')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'limit',
    example: 10,
    description: 'limit quantity per page',
  })
  @ApiQuery({
    name: 'page',
    example: 1,
    description: 'number of page',
  })
  async myBannedUsers(
    @Logged() user: ILogged,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    return await this.banService.listBannedUser(user._id, { limit, page });
  }
}
