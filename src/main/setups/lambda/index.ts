import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import { Handler } from 'aws-lambda';
import { AppModule } from '../../app.module';
import { setupSwagger } from 'src/main/config/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

async function bootstrapLambda(): Promise<Handler> {
  mongoose.plugin(mongoosePaginate);
  const app = await NestFactory.create(AppModule, { rawBody: true });
  setupSwagger(app);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export { bootstrapLambda };
