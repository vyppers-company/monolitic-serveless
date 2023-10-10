import 'dotenv/config';

export const environment = {
  app: {
    env: process.env.NODE_ENV || '',
    timeZone: process.env.TZ || '',
    port: process.env.PORT || 3000,
    serviceName: process.env.SERVICE_NAME || '',
    cors: Array.from(process.env.ORIGINS.split(',')) || [],
  },
  oauth: {
    google: {
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET || '',
      callbackUrl: process.env.GOOGLE_AUTH_CALLBACK_URL || '',
      scope: Array.from(process.env.GOOGLE_AUTH_SCOPE.split(',')) || [],
    },
    facebook: {
      clientID: process.env.FACEBOOK_AUTH_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_AUTH_CLIENT_SECRET || '',
      callbackUrl: process.env.FACEBOOK_AUTH_CALLBACK_URL || '',
      fields: Array.from(process.env.FACEBOOK_AUTH_FIELDS.split(',')) || [],
    },
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
      content: process.env.MONGODB_COLLECTION_CONTENT || '',
    },
  },
  aws: {
    clientId: process.env.AWS_CLIENT_ID_INTERNAL || '',
    secretKey: process.env.AWS_SECRET_KEY_INTERNAL || '',
    region: process.env.AWS_REGION_INTERNAL,
  },
  storage: {
    client_email: process.env.CLIENT_EMAIL || '',
    private_key: process.env.PRIVATE_KEY || '',
    bucket: {
      name: process.env.BUCKET_NAME || '',
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
