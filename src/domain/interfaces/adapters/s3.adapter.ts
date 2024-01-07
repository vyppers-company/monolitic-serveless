export interface IS3Options {
  Bucket: string;
  Key: string;
  Body?: any;
  ACL?: any;
  ContentType?: string;
}

export interface IS3Adapter {
  putObjectCommand: (options: IS3Options) => Promise<void>;
  deleteObjectCommand: (options: IS3Options) => Promise<void>;
}
