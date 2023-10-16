import { Injectable } from '@nestjs/common';
import { S3, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { environment } from 'src/main/config/environment/environment';
import * as mime from 'mime-types';
import { randomUUID } from 'node:crypto';
import { ITypeContent } from '../entity/contents';
import { blur, composite } from 'src/shared/utils/sharp';
import { getImageFromExternalUrl } from 'src/shared/helpers/get-image-from-external-url';

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
    const BufferWaterMark = await getImageFromExternalUrl(
      environment.app.waterMark,
    );
    const uploads: string[] = [];
    const fileExtName = mime.extension(file.mimetype);
    const randomName = randomUUID();
    await s3.send(
      new PutObjectCommand({
        Bucket: environment.aws.midias,
        Key: `${owner}/${type}/${randomName}.${fileExtName}`,
        Body: await composite(file.buffer, BufferWaterMark),
        ACL: 'public-read',
        ContentType: file.mimetype,
      }),
    );
    uploads.push(
      `${environment.aws.hostBucket}/${owner}/${type}/${randomName}.${fileExtName}`,
    );
    if (type !== ITypeContent.PROFILE) {
      const randomNameBlur = randomUUID();

      await s3.send(
        new PutObjectCommand({
          Bucket: environment.aws.midias,
          Key: `${owner}/${type}/${randomNameBlur}-payed.${fileExtName}`,
          Body: await composite(await blur(file.buffer), BufferWaterMark),
          ACL: 'public-read',
          ContentType: file.mimetype,
        }),
      );
      uploads.push(
        `${environment.aws.hostBucket}/${owner}/${type}/${randomNameBlur}-payed.${fileExtName}`,
      );
    }
    return uploads;
  }
  async deleteObject(url: string) {
    const key = url.split('/');
    await s3.send(
      new DeleteObjectCommand({
        Bucket: environment.aws.midias,
        Key: `${key[3]}/${key[4]}/${key[5]}`,
      }),
    );
    return;
  }
}
