/* import { Controller, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ILogged } from 'src/domain/interfaces/others/logged.interface';
import { Logged } from 'src/shared/decorators/logged.decorator';

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(private readonly makeLike: MakeLikeService) {}

  @Put('v1/like/:contentId')
  @ApiBearerAuth()
  async likContent(@Logged() logged: ILogged) {
    await this.contentLike.executeLike();
  }
} */
