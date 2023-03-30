import 'dotenv/config';

export const environment = {
  urlServer: process.env.URL_SERVER || '',
  env: process.env.NODE_ENV || '',
  timeZone: process.env.TZ || '',
  port: process.env.PORT,
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
    db: process.env.MONGODB_NAME || '',
  },
  cryptoData: {
    cipherString: process.env.CIPHER_STRING,
    keyPass: process.env.KEY_PASS,
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
