import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ILogged } from 'src/domain/interfaces/others/logged.interface';
import { CreateRoomLiveService } from 'src/domain/usecases/create-room.service';
import { Logged } from 'src/shared/decorators/logged.decorator';
import {
  CreateLiveChannelDto,
  InviteUserLiveStreamDto,
} from '../dtos/livestream.dto';

@Controller('livestream')
@ApiTags('livestream')
export class LiveStreamingController {
  private logger: Logger;
  constructor(private readonly liveStream: CreateRoomLiveService) {
    this.logger = new Logger();
  }

  /*  @Post('v1/create-live-channel')
  @ApiBearerAuth()
  @ApiBody({ type: CreateLiveChannelDto })
  @ApiOperation({
    summary: 'SEM USO',
    description: 'DEPRECATED',
  })
  createLiveLiveChannel(
    @Logged() user: ILogged,
    @Body() body: CreateLiveChannelDto,
  ) {
    return this.liveStream.createLiveChannel({
      isPrivate: body.isPrivate,
      keepRecord: body.keepRecord,
      plansId: body.plansId,
      creatorId: user._id,
      title: body.title,
    });
  } */
  @Post('v1/create-room')
  @ApiBearerAuth()
  @ApiBody({ type: CreateLiveChannelDto })
  createLiveChannelRealTime(
    @Logged() user: ILogged,
    @Body() body: CreateLiveChannelDto,
  ) {
    return this.liveStream.createLiveChannelRealTime({
      isPrivate: body.isPrivate,
      keepRecord: body.keepRecord,
      plansId: body.plansId,
      creatorId: user._id,
      title: body.title,
    });
  }
  @Post('v1/invite-user')
  @ApiBearerAuth()
  @ApiBody({ type: InviteUserLiveStreamDto })
  inviteUser(@Logged() user: ILogged, @Body() body: InviteUserLiveStreamDto) {
    return this.liveStream.inviteUserLiveStream({
      inviterId: user._id,
      invites: body.invites,
      salaArn: body.salaArn,
    });
  }
}
