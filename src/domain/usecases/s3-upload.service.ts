import { Injectable } from '@nestjs/common';
import { S3, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { environment } from 'src/main/config/environment/environment';
import * as mime from 'mime-types';
import { randomUUID } from 'node:crypto';

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
    return `${environment.aws.hostBucket}/${owner}/${type}/${randomName}.${fileExtName}`;
  }
  async deleteObject(url: string) {
    const key = url.split('/');
    return await s3.send(
      new DeleteObjectCommand({
        Bucket: environment.aws.midias,
        Key: `${key[3]}/${key[4]}/${key[5]}`,
      }),
    );
  }
}
