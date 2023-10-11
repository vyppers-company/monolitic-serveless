import {
  Controller,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Logger,
  Delete,
  Body,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteUpload } from '../dtos/delete-upload';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { TYPEUPLOAD } from 'src/domain/interfaces/others/type-upload.enum';
import { CreateUpload } from '../dtos/file-upload.dto';
import { S3Service } from 'src/domain/usecases/s3-upload.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Logged } from 'src/shared/decorators/logged.decorator';
import { ILogged } from 'src/domain/interfaces/others/logged.interface';

@ApiTags('upload-general')
@Controller('midia')
export class UploadController {
  logger: Logger;
  constructor(private readonly s3Service: S3Service) {
    this.logger = new Logger();
  }

  @Patch('v1/upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({
    name: 'type',
    required: true,
    enum: TYPEUPLOAD,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'midia',
    type: CreateUpload,
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 1 }]))
  async profileImageV2(
    @UploadedFiles() file,
    @Query('type') type: string,
    @Logged() userLogged: ILogged,
  ) {
    if (!file?.file.length) {
      throw new BadRequestException('Midia é obrigátoria');
    }
    const path = await this.s3Service.uploadFile(
      file.file[0],
      type,
      userLogged._id,
    );
    return { path };
  }

  @Delete('v1/delete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({
    description: 'midia',
    type: DeleteUpload,
  })
  async DeleteMidiaV2(@Body() body: DeleteUpload) {
    const url = body.url.split('?')[0];
    await this.s3Service.deleteObject(url);
  }
}
