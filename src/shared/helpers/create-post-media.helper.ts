import { GoogleStorageMulter } from './google-storage-multer';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { generateFileName } from './generate-file-names.helper';
import { Request } from 'express';
import { scryptSync } from 'crypto';
import { jwtDecrypt } from 'jose';
import { UnauthorizedException } from '@nestjs/common';
import { environment } from 'src/main/config/environment/environment';
import { TYPEUPLOAD } from 'src/domain/interfaces/others/type-upload.enum';

const createPostMediasFileInterceptor = () =>
  FileFieldsInterceptor([{ name: 'file', maxCount: 1 }], {
    storage: new GoogleStorageMulter({
      destination: async (req: Request, file: any, cb: any) => {
        const authorization =
          (req.headers.authorization || '').split(' ')[1] || '';

        const {
          cryptoData: { keyPassUser, keySalt, keyLength },
        } = environment;

        const key = scryptSync(keyPassUser, keySalt, keyLength);
        const decrypted = await jwtDecrypt(authorization, key);

        if (!Object.keys(decrypted.payload).length) {
          return new UnauthorizedException('type of upload not authorized');
        }
        const type = req.query['type'] as string;
        if (!type || !TYPEUPLOAD[type]) {
          return new UnauthorizedException('type of upload not authorized');
        }
        cb(null, `/${decrypted.payload?._id}/${type.trim() || ''.trim()}`);
      },
      filename: generateFileName,
      bucketName: environment.storage.bucket.name,
      client_email: environment.storage.client_email,
      private_key: environment.storage.private_key.replace(/\\n/g, '\n'),
    }),
  });

export default createPostMediasFileInterceptor;
