import * as mime from 'mime-types';
import { randomUUID } from 'node:crypto';
import { Express } from 'express';
export const generateFileName = (
  _: Express.Request,
  file: any,
  callback: (error: Error | null, filename: string) => void,
): void => {
  const fileExtName = mime.extension(file.mimetype);
  const randomName = randomUUID();
  callback(null, `${randomName}.${fileExtName}`);
};
