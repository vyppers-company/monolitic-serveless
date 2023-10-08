import { Injectable } from '@nestjs/common';
import { S3, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { environment } from 'src/main/config/environment/environment';

const s3 = new S3({
  region: environment.aws.region,
  credentials: {
    accessKeyId: environment.aws.clientId,
    secretAccessKey: environment.aws.secretKey,
  },
});

@Injectable()
export class S3Service {
  async uploadFile(file: Express.Multer.File) {
    return await s3.send(
      new PutObjectCommand({
        Bucket: environment.storage.bucket.name,
        Key: '',
        Body: file.stream,
        ACL: 'public-read',
        ContentType: file.mimetype,
        ContentDisposition: 'inline',
      }),
    );
  }
  async deleteObject(url: string) {
    return await s3.send(
      new DeleteObjectCommand({
        Bucket: environment.storage.bucket.name,
        BypassGovernanceRetention: false,
        Key: url,
      }),
    );
  }
}
