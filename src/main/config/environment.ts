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
    apiKey: process.env.X_API_KEY || '',
  },
};
