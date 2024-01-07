import { DeleteObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import {
  IS3Adapter,
  IS3Options,
} from 'src/domain/interfaces/adapters/s3.adapter';

@Injectable()
export class S3Adapter implements IS3Adapter {
  constructor(@Inject('s3') private readonly s3Adapter: S3) {}
  async putObjectCommand(options: IS3Options) {
    await this.s3Adapter.send(new PutObjectCommand(options));
  }
  async deleteObjectCommand(options: IS3Options) {
    await this.s3Adapter.send(new DeleteObjectCommand(options));
  }
}
