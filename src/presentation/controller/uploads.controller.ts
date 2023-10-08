import {
  Controller,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Logger,
  Delete,
  Inject,
  Body,
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
import { GoogleStorageMulter } from 'src/shared/helpers/google-storage-multer';
import createPostMediasFileInterceptor from 'src/shared/helpers/create-post-media.helper';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/domain/usecases/s3-upload.service';

@ApiTags('upload-general')
@Controller('midia')
export class UploadController {
  logger: Logger;
  constructor(
    @Inject('UPLOAD') private readonly googleStorageMulter: GoogleStorageMulter,
    private readonly s3Service: S3Service,
  ) {
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
  @UseInterceptors(createPostMediasFileInterceptor())
  async profileImage(@UploadedFiles() file: any) {
    if (!file.file) {
      throw new BadRequestException('Midia é obrigátoria');
    }
    return { path: file.file[0].path };
  }

  @Patch('v2/upload/s3')
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
  @UseInterceptors(FileInterceptor('file'))
  async profileImageV2(@UploadedFiles() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Midia é obrigátoria');
    }
    const path = await this.s3Service.uploadFile(file);
    return { path };
  }

  @Delete('v1/delete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({
    description: 'midia',
    type: DeleteUpload,
  })
  async DeleteMidia(@Body() body: DeleteUpload) {
    const url = body.url.split('?')[0];
    await this.googleStorageMulter.removeByUrl(url);
  }

  @Delete('v2/delete/s3')
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
