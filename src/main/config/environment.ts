import 'dotenv/config';

export const environment = {
  app: {
    env: process.env.NODE_ENV || '',
    timeZone: process.env.TZ || '',
    port: process.env.PORT || 3000,
    serviceName: process.env.SERVICE_NAME || '',
  },
  mail: {
    domain: process.env.DOMAIN_NAME || '',
    apiKey: process.env.MAILGUN_API_KEY || '',
    from: process.env.FROM_MAIL || '',
    expiration: parseInt(process.env.EXPIRATION) || 120000,
  },
  sms: {
    apiUrl: process.env.SMS_API_URL || '',
  },
  mongodb: {
    url: process.env.MONGODB_URL || '',
    collections: {
      code: process.env.MONGODB_COLLECTION_CODE || '',
      user: process.env.MONGODB_COLLECTION_USER || '',
    },
  },
  cryptoData: {
    cipherString: process.env.CIPHER_STRING,
    keyPassUser: process.env.KEY_PASS_USER,
    keyPassCode: process.env.KEY_PASS_CODE,
    keySalt: process.env.KEY_SALT,
    keyLength: Number(process.env.KEY_LENGTH),
    bufferSize: Number(process.env.BUFFER_SIZE),
    bufferFill: process.env.BUFFER_FILL,
    jwe: {
      expiresIn: process.env.SESSION_EXPIRE,
      algorithm: process.env.ALGORITHM,
      encrypt: process.env.ENCRYPT,
    },
  },
};
