import 'dotenv/config';

export const environment = {
  urlServer: process.env.URL_SERVER || '',
  env: process.env.NODE_ENV || '',
  timeZone: process.env.TZ || '',
  port: process.env.PORT,
  mongodb: {
    url: process.env.MONGODB_URL || '',
    db: process.env.MONGODB_NAME || '',
    collection: process.env.MONGODB_COLLECTION_NAME || '',
  },
  secret: {
    jwt: process.env.SECRET_KEY || '',
  },
  cryptoData: {
    cipherString: process.env.CIPHER_STRING,
    keyPass: process.env.KEY_PASS,
    keySalt: process.env.KEY_SALT,
    keyLength: Number(process.env.KEY_LENGTH),
    bufferSize: Number(process.env.BUFFER_SIZE),
    bufferFill: process.env.BUFFER_FILL,
    encryptBaseEncoding: process.env.ENCRYPT_BASE_ENCODING,
  },
};
