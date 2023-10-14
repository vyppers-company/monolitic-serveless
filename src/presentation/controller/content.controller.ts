import {
  Body,
  Controller,
  Post,
  Delete,
  Param,
  Put,
  Get,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EditContentService } from 'src/domain/usecases/edit-content.service';
import { GetContentService } from 'src/domain/usecases/get-content.service';
import { DeleteContentService } from 'src/domain/usecases/delete-content.service';
import { CreateContentDto } from '../dtos/create-content.dto';
import { ILogged } from 'src/domain/interfaces/others/logged.interface';
import { Logged } from 'src/shared/decorators/logged.decorator';
import { EditContentDto } from '../dtos/edit-content.dto';
import { ITypeContent } from 'src/domain/entity/contents';
import { CreateContentService } from 'src/domain/usecases/create-content.service';
import { FeedService } from 'src/domain/usecases/feed.service';

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(
    private readonly createService: CreateContentService,
    private readonly deleteService: DeleteContentService,
    private readonly editService: EditContentService,
    private readonly getService: GetContentService,
    private readonly feedService: FeedService,
  ) {}

  @Post('v1/create')
  @ApiBearerAuth()
  @ApiBody({ type: CreateContentDto })
  async createContent(
    @Body() dto: CreateContentDto,
    @Logged() userLogged: ILogged,
  ) {
    await this.createService.create(dto, userLogged._id);
  }

  @Delete('v1/:contentId/delete')
  @ApiBearerAuth()
  async deleteContent(
    @Param('contentId') contentId: string,
    @Logged() userLogged: ILogged,
  ) {
    await this.deleteService.deleteContent({
      contentId,
      ownerId: userLogged._id,
    });
  }

  @Put('v1/:contentId/edit')
  @ApiBearerAuth()
  @ApiBody({ type: EditContentDto })
  async putContent(
    @Param('contentId') contentId: string,
    @Body() dto: EditContentDto,
    @Logged() userLogged: ILogged,
  ) {
    await this.editService.editContent({
      text: dto.text,
      contentId: contentId,
      owner: userLogged._id,
    });
  }

  @Get('v1/all')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'profileId',
    required: false,
    description:
      'se nao passar o profileId significa que esta buscando um conteudo proprio',
  })
  @ApiQuery({ name: 'type', required: true, enum: ITypeContent })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'quantidade que deseja buscar. valor padrao 10',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'numero da pagina que deseja buscar. valo padrao 0',
  })
  async getContents(
    @Query('profileId') profileId: string,
    @Query('type') type: ITypeContent,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Logged() userLogged: ILogged,
  ) {
    return await this.getService.getContents(
      profileId,
      userLogged._id,
      type,
      limit || 10,
      offset || 0,
    );
  }

  @Get('v1/unique/:contentId')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'profileId',
    required: false,
    description:
      'se nao passar o profileId significa que esta buscando um conteudo proprio',
  })
  async getContentById(
    @Query('profileId') profileId: string,
    @Param('contentId') contentId: string,
    @Logged() userLogged: ILogged,
  ) {
    return await this.getService.getContent(
      profileId,
      userLogged._id,
      contentId,
    );
  }

  @Get('v1/feed/simple')
  @ApiBearerAuth()
  async GetFeed() {
    return await this.feedService.feed(ITypeContent.FEED);
  }

  @Get('v1/story/simple')
  @ApiBearerAuth()
  async GetStory() {
    return await this.feedService.feed(ITypeContent.STORY);
  }

  @Get('v1/shorts/simple')
  @ApiBearerAuth()
  async GetShorts() {
    return await this.feedService.feed(ITypeContent.SHORTS);
  }

  /* @Get('v1/profile/picture')
  @ApiBearerAuth()
  async getProfilePhoto(@Logged() userLogged: ILogged) {
    return await this.getService.getProfileImage(userLogged._id);
  } */
}
