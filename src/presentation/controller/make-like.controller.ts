import { Controller, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ILogged } from 'src/domain/interfaces/others/logged.interface';
import { MakeLikeService } from 'src/domain/usecases/make-like.service';
import { Logged } from 'src/shared/decorators/logged.decorator';

@ApiTags('reactions')
@Controller('reactions')
export class ReactionsController {
  constructor(private readonly makeLike: MakeLikeService) {}

  @Put('v1/like/:contentId')
  @ApiBearerAuth()
  async likContent(
    @Param('contentId') contentId: string,
    @Logged() logged: ILogged,
  ) {
    this.makeLike.makeLike(contentId, logged._id);
  }
}
