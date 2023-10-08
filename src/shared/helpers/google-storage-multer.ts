import { Bucket, Storage } from '@google-cloud/storage';

import { Request } from 'express';
import multer from 'multer';

type FilenameProps = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) => void;

type DestinationProps = (
  req: Request,
  file: Express.Multer.File,
  callback: (error?: any, path?: string) => void,
) => void;

interface PropOpts {
  bucketName: string;
  client_email: string;
  private_key: string;
  filename?: FilenameProps;
  destination?: DestinationProps;
}

export class GoogleStorageMulter implements multer.StorageEngine {
  private bucket: Bucket;
  private getFilename: FilenameProps | undefined;
  private destination: DestinationProps | undefined;
  private bucketName: string;
  private client_email: string;
  private private_key: string;
  constructor(opts: PropOpts) {
    this.bucketName = opts.bucketName;
    this.client_email = opts.client_email;
    this.private_key = opts.private_key;
    if (!this.bucketName) throw new Error('BUCKET_NAME is required');

    const storage = new Storage({
      credentials: {
        client_email: this.client_email,
        private_key: this.private_key,
      },
    });
    this.bucket = storage.bucket(this.bucketName);
    this.getFilename = opts.filename;
    this.destination = opts?.destination;
  }

  _handleFile(
    req: Request,
    file: Express.Multer.File,
    callback: (error?: any, info?: Partial<Express.Multer.File>) => void,
  ): void {
    this.getDestination(req, file, (err, path) => {
      if (err) return callback(err);

      if (!this.getFilename) return callback(err);

      this.getFilename(req, file, (err, filename) => {
        if (err) return callback(err);

        const pathWithName = `${path}/${filename}`;
        const blob = this.bucket.file(pathWithName);
        const blobStream = blob.createWriteStream();

        file.stream
          .pipe(blobStream)
          .on('error', (err) => callback(err))
          .on('finish', async () => {
            const url = (
              await blob.getSignedUrl({
                action: 'read',
                expires: '03-01-2500',
              })
            )[0];
            callback(null, {
              path: url,
              filename: pathWithName,
            });
          });
      });
    });
  }

  /*  _removeFile(
        req: Request,
        file: Express.Multer.File,
        callback: (error: Error) => void,
    ): void {
        const bucket = this.bucket.file(file.filename);

        bucket
            .delete()
            .then(() => callback(null as any))
            .catch((err) => callback(err));
    } */

  removeFiles(filesUrls: string[]) {
    if (filesUrls.length === 0) throw new Error();
    filesUrls.map(async (media) => {
      await this.bucket.file(media).delete();
    });
  }

  getDestination(
    req: Request,
    file: Express.Multer.File,
    callback: (error?: any, path?: string) => void,
  ): void {
    if (this.destination) {
      this.destination(req, file, (err, path) => {
        if (!err) {
          callback(null, this.clearPath(path || ''));
        } else {
          callback(err, undefined);
        }
      });
    } else {
      callback(null, '');
    }
  }

  async _removeFile(
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null) => void,
  ): Promise<void> {
    await this.removeFileFromBucketByFilename(file.filename)
      .then(() => callback(null))
      .catch((err) => callback(err));
  }

  private async removeFileFromBucketByFilename(
    filename: string,
  ): Promise<void> {
    const bucket = this.bucket.file(filename);
    await bucket.delete();
  }

  async removeByUrl(url: string): Promise<void> {
    const paths = url.split('/');
    await this.removeFileFromBucketByFilename(
      `${paths[4]}/${paths[5]}/${paths[6]}`,
    );
  }

  private clearPath(path: string) {
    let clearedPath = path;

    if (clearedPath.charAt(0) === '/') {
      clearedPath = clearedPath.substring(1, clearedPath.length);
    }

    if (clearedPath.charAt(clearedPath.length - 1) === '/') {
      clearedPath = clearedPath.substring(0, clearedPath.length - 1);
    }

    return clearedPath;
  }
}
