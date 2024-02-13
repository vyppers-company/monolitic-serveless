export interface IS3Options {
  Bucket: string;
  Key: string;
  Body?: any;
  ACL?: any;
  ContentType?: string;
}

export const authorizedImages = ['jpeg', 'png', 'webp'];
export const authorizedVideos = [
  'mp4',
  'mov',
  'avi',
  'wmv',
  'flv',
  'mkv',
  '3gp',
  'webm',
  'm4v',
  'ogv',
];

export interface IS3Adapter {
  putObjectCommand: (options: IS3Options) => Promise<void>;
  deleteObjectCommand: (options: IS3Options) => Promise<void>;
}
