import 'dotenv/config';

export const environment = {
  app: {
    env: process.env.NODE_ENV || '',
    timeZone: process.env.TZ || '',
    port: process.env.PORT || 3000,
    serviceName: process.env.SERVICE_NAME || '',
    cors: Array.from(process.env.ORIGINS.split(',')) || [],
    waterMark: process.env.WATER_MARK || '',
    domain: process.env.DOMAIN_WEB_APP || '',
  },
  captcha: {
    secret: process.env.SECRET_CAPTCHA || '',
    verifyUrl: process.env.VERIFY_URL,
  },
  vapid: {
    publicKey: process.env.VAPID_PUBLIC_KEY || '',
    privateKey: process.env.VAPID_PRIVATE_KEY || '',
    email: process.env.VAPID_EMAIL || '',
  },
  payment: {
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY || '',
      webhooks: {
        payment: {
          subscription: {
            failed: process.env.WEBHOOK_PAYMENT_SUBSCRIPTION_FAILED || '',
          },
        },
      },
    },
  },
  oauth: {
    redirectFrontUrl: process.env.REDIRECT_FRONTEND_URL || '',
    facebook: {
      clientId: process.env.FACEBOOK_AUTH_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_AUTH_CLIENT_SECRET || '',
      callbackUrl: process.env.FACEBOOK_AUTH_CALLBACK_URL || '',
      fields: Array.from(process.env.FACEBOOK_AUTH_FIELDS.split(',')) || [],
    },
  },
  sms: {
    apiUrl: process.env.SMS_API_URL || '',
  },
  mongodb: {
    url: process.env.MONGODB_URL || '',
    collections: {
      purchase: process.env.MONGO_COLLECTION_MY_PURCHASE || '',
      transaction: process.env.MONGO_COLLECTION_TRANSACTION || '',
      denunciate: process.env.MONGO_COLLECTION_DENUNCIATE || '',
      code: process.env.MONGODB_COLLECTION_CODE || '',
      user: process.env.MONGODB_COLLECTION_USER || '',
      internalUser: process.env.MONGODB_COLLECTION_INTERNAL_USER || '',
      content: process.env.MONGODB_COLLECTION_CONTENT || '',
      plan: process.env.MONGODB_COLLECTION_PLAN || '',
      product: process.env.MONGODB_COLLECTION_PRODUCT || '',
      payment: process.env.MONGODB_COLLECTION_PAYMENT || '',
      verifyDocuments: process.env.MONGODB_COLLECTION_VERIFICATION || '',
      configNotification:
        process.env.MONGO_COLLECTION_CONFIG_NOTIFICATION || '',
      notifications: process.env.MONGO_COLLECTION_NOTIFICATIONS || '',
    },
  },
  aws: {
    config: {
      clientId: process.env.AWS_CLIENT_ID_INTERNAL || '',
      secretKey: process.env.AWS_SECRET_KEY_INTERNAL || '',
      region: process.env.AWS_REGION_INTERNAL,
    },
    s3: {
      midias: process.env.AWS_BUCKET_NAME_INTERNAL || '',
      hostBucket: process.env.AWS_BUCKET_URL || '',
    },
    ivs: {},
  },
  sendCode: {
    expiration: Number(process.env.SEND_CODE_EXPIRATION) || 60,
  },
  cryptoData: {
    cipherString: process.env.CIPHER_STRING,
    keyPassUser: process.env.KEY_PASS_USER,
    keyPassCode: process.env.KEY_PASS_CODE,
    keyPassInternalUser: process.env.KEY_PASS_INTERNAL_USER,
    keySalt: process.env.KEY_SALT,
    keyLength: Number(process.env.KEY_LENGTH),
    bufferSize: Number(process.env.BUFFER_SIZE),
    bufferFill: process.env.BUFFER_FILL,
    jwe: {
      expiresInDays: Number(process.env.SESSION_EXPIRE),
      algorithm: process.env.ALGORITHM,
      encrypt: process.env.ENCRYPT,
    },
  },
};
