import { BadRequestException, Injectable } from '@nestjs/common';
import { environment } from 'src/main/config/environment/environment';
import * as mime from 'mime-types';
import { randomUUID } from 'node:crypto';
import { ITypeContent, IUploadContent } from '../entity/contents';
import { blur } from 'src/shared/utils/sharp';
import { captureScreenshotFromS3 } from 'src/shared/helpers/screenshot';
import { S3Adapter } from 'src/infra/adapters/aws/s3/s3.adapter';

@Injectable()
export class S3Service {
  constructor(private readonly s3Adapter: S3Adapter) {}
  async uploadFile(file: any, type: string, owner: string) {
    if (!String(typeof file.mimetype == 'string')) {
      throw new BadRequestException('mimetype needs to be a string');
    }
    if (file.mimetype.includes('video') && type === ITypeContent.PROFILE) {
      throw new BadRequestException('profile cant be a video');
    }
    const uploads = { _id: randomUUID() } as IUploadContent;
    uploads['type'] = mime.extension(file.mimetype) as string;

    if (file.mimetype.includes('video')) {
      const fileExtName = mime.extension(file.mimetype);
      const randomName = randomUUID();
      await this.s3Adapter.putObjectCommand({
        Bucket: environment.aws.s3.midias,
        Key: `${owner}/${type}/${randomName}.${fileExtName}`,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
      });
      uploads[
        'content'
      ] = `${environment.aws.s3.hostBucket}/${owner}/${type}/${randomName}.${fileExtName}`;

      const screenshot = await captureScreenshotFromS3(
        `${environment.aws.s3.hostBucket}/${owner}/${type}/${randomName}.${fileExtName}`,
      );
      const randomNameBlur = randomUUID();
      await this.s3Adapter.putObjectCommand({
        Bucket: environment.aws.s3.midias,
        Key: `${owner}/${type}/${randomNameBlur}-blocked.jpg`,
        Body: await blur(screenshot),
        ACL: 'public-read',
        ContentType: 'image/jpg',
      });
      uploads[
        'blockedThumb'
      ] = `${environment.aws.s3.hostBucket}/${owner}/${type}/${randomNameBlur}-blocked.jpg`;

      const randomNameThumb = randomUUID();
      await this.s3Adapter.putObjectCommand({
        Bucket: environment.aws.s3.midias,
        Key: `${owner}/${type}/${randomNameThumb}-thumb.jpg`,
        Body: screenshot,
        ACL: 'public-read',
        ContentType: 'image/jpg',
      });
      uploads[
        'thumb'
      ] = `${environment.aws.s3.hostBucket}/${owner}/${type}/${randomNameThumb}-thumb.jpg`;

      return uploads;
    }

    if (!file.mimetype.includes('video')) {
      const fileExtName = mime.extension(file.mimetype);
      const randomName = randomUUID();
      await this.s3Adapter.putObjectCommand({
        Bucket: environment.aws.s3.midias,
        Key: `${owner}/${type}/${randomName}.${fileExtName}`,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
      });
      uploads[
        'content'
      ] = `${environment.aws.s3.hostBucket}/${owner}/${type}/${randomName}.${fileExtName}`;
      uploads[
        'thumb'
      ] = `${environment.aws.s3.hostBucket}/${owner}/${type}/${randomName}.${fileExtName}`;

      if (type !== ITypeContent.PROFILE && type !== ITypeContent.DOCUMENT) {
        const randomNameBlur = randomUUID();
        await this.s3Adapter.putObjectCommand({
          Bucket: environment.aws.s3.midias,
          Key: `${owner}/${type}/${randomNameBlur}-blocked.${fileExtName}`,
          Body: await blur(file.buffer),
          ACL: 'public-read',
          ContentType: file.mimetype,
        });
        uploads[
          'blockedThumb'
        ] = `${environment.aws.s3.hostBucket}/${owner}/${type}/${randomNameBlur}-blocked.${fileExtName}`;
      }
      return uploads;
    }
  }

  async deleteObject(urls: string[]) {
    const keys = urls.map((url) => url.split('/'));
    await Promise.all(
      keys.map(async (key, index) => {
        return await this.s3Adapter.deleteObjectCommand({
          Bucket: environment.aws.s3.midias,
          Key: `${key[index][3]}/${key[index][4]}/${key[index][5]}`,
        });
      }),
    );
    return;
  }
}
