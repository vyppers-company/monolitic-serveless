import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
import { AppModule } from './main/app.module';
import { environment } from './main/config/environment';

const setupSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('Cuidame - Bff-ms-register')
    .setDescription(
      'Este microserviço registra usuários do tipo: cliente,profissional, admins e funcionários da empresa',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api/bffmsregister/');
  setupSwagger(app);
  await app.listen(environment.port, () => {
    Logger.log('Listening at http://localhost:' + environment.port + '/');
  });
}
//
bootstrap();
