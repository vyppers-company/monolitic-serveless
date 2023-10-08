import * as mime from 'mime-types';
import { randomUUID } from 'node:crypto';

export const generateFileName = (
  _: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
): void => {
  const fileExtName = mime.extension(file.mimetype);
  const randomName = randomUUID();
  callback(null, `${randomName}.${fileExtName}`);
};
