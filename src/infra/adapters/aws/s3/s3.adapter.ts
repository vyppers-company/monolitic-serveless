import { DeleteObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import {
  IS3Adapter,
  IS3Options,
} from 'src/domain/interfaces/adapters/s3.adapter';

@Injectable()
export class S3Adapter implements IS3Adapter {
  constructor(@Inject('s3') private readonly s3Adapter: S3) {}
  async putObjectCommand(options: IS3Options) {
    try {
      await this.s3Adapter.send(new PutObjectCommand(options));
    } catch (error) {
      throw new HttpException(error?.Error || 'Internal Server Error', 500);
    }
  }
  async deleteObjectCommand(options: IS3Options) {
    try {
      await this.s3Adapter.send(new DeleteObjectCommand(options));
    } catch (error) {
      throw new HttpException(error?.Error || 'Internal Server Error', 500);
    }
  }
}
