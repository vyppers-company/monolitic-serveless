import { BadRequestException, Injectable } from '@nestjs/common';
import { S3, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { environment } from 'src/main/config/environment/environment';
import * as mime from 'mime-types';
import { randomUUID } from 'node:crypto';
import { ITypeContent } from '../entity/contents';
import { blur } from 'src/shared/utils/sharp';
import { captureScreenshotFromS3 } from 'src/shared/helpers/screenshot';

const s3 = new S3({
  region: environment.aws.region,
  credentials: {
    accessKeyId: environment.aws.clientId,
    secretAccessKey: environment.aws.secretKey,
  },
});

@Injectable()
export class S3Service {
  async uploadFile(file: any, type: string, owner: string) {
    if (file.mimetype.includes('video') && type === ITypeContent.PROFILE) {
      throw new BadRequestException('profile cant be a video');
    }
    if (file.mimetype.includes('video')) {
      const uploads: string[] = [];
      const fileExtName = mime.extension(file.mimetype);
      const randomName = randomUUID();
      await s3.send(
        new PutObjectCommand({
          Bucket: environment.aws.midias,
          Key: `${owner}/${type}/${randomName}.${fileExtName}`,
          Body: file.buffer,
          ACL: 'public-read',
          ContentType: file.mimetype,
        }),
      );
      uploads.push(
        `${environment.aws.hostBucket}/${owner}/${type}/${randomName}.${fileExtName}`,
      );
      const screenshot = await captureScreenshotFromS3(
        `${environment.aws.hostBucket}/${owner}/${type}/${randomName}.${fileExtName}`,
      );
      const randomNameBlur = randomUUID();
      await s3.send(
        new PutObjectCommand({
          Bucket: environment.aws.midias,
          Key: `${owner}/${type}/${randomNameBlur}-blocked.jpg`,
          Body: await blur(screenshot),
          ACL: 'public-read',
          ContentType: 'image/jpg',
        }),
      );
      uploads.push(
        `${environment.aws.hostBucket}/${owner}/${type}/${randomNameBlur}-blocked.jpg`,
      );
      return uploads;
    }

    if (!file.mimetype.includes('video')) {
      const uploads: string[] = [];
      const fileExtName = mime.extension(file.mimetype);
      const randomName = randomUUID();
      await s3.send(
        new PutObjectCommand({
          Bucket: environment.aws.midias,
          Key: `${owner}/${type}/${randomName}.${fileExtName}`,
          Body: file.buffer,
          ACL: 'public-read',
          ContentType: file.mimetype,
        }),
      );
      uploads.push(
        `${environment.aws.hostBucket}/${owner}/${type}/${randomName}.${fileExtName}`,
      );
      if (type !== ITypeContent.PROFILE && type !== ITypeContent.DOCUMENT) {
        const randomNameBlur = randomUUID();
        await s3.send(
          new PutObjectCommand({
            Bucket: environment.aws.midias,
            Key: `${owner}/${type}/${randomNameBlur}-blocked.${fileExtName}`,
            Body: await blur(file.buffer),
            ACL: 'public-read',
            ContentType: file.mimetype,
          }),
        );
        uploads.push(
          `${environment.aws.hostBucket}/${owner}/${type}/${randomNameBlur}-blocked.${fileExtName}`,
        );
      }
      return uploads;
    }
  }

  async deleteObject(urls: string[]) {
    const keys = urls.map((url) => url.split('/'));
    await Promise.all(
      keys.map(async (key, index) => {
        return await s3.send(
          new DeleteObjectCommand({
            Bucket: environment.aws.midias,
            Key: `${key[index][3]}/${key[index][4]}/${key[index][5]}`,
          }),
        );
      }),
    );
    return;
  }
}
