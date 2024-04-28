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
import { ICurrency } from 'src/domain/entity/currency';

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
    await this.createService.create(
      { ...dto, plans: dto.plans ? dto.plans : [] },
      userLogged._id,
    );
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
      plans: dto.plans || [],
      contentId: contentId,
      owner: userLogged._id,
      product: {
        price: dto.product.price,
      },
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
    name: 'page',
    required: false,
    description: 'numero da pagina que deseja buscar. valo padrao 1',
  })
  async getContents(
    @Query('profileId') profileId: string,
    @Query('type') type: ITypeContent,
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Logged() userLogged: ILogged,
  ) {
    return await this.getService.getContents(
      profileId,
      userLogged._id,
      type,
      limit || 10,
      page || 1,
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
  async GetFeed(
    @Logged() userLogged: ILogged,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return await this.feedService.feed(
      ITypeContent.FEED,
      userLogged._id,
      limit || 10,
      page || 1,
    );
  }

  @Get('v1/story/simple')
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
  async GetStory(
    @Logged() userLogged: ILogged,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return await this.feedService.feed(
      ITypeContent.STORY,
      userLogged._id,
      limit || 10,
      page || 1,
    );
  }

  @Get('v1/short/simple')
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
  async GetShorts(
    @Logged() userLogged: ILogged,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return await this.feedService.feed(
      ITypeContent.SHORTS,
      userLogged._id,
      limit || 10,
      page || 1,
    );
  }
}
