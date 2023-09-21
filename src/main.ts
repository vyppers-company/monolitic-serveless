import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './main/app.module';
import { environment } from './main/config/environment';

const setupSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle(`Xfans - ${environment.app.serviceName}`)
    .setDescription(
      'Este microserviço registra usuários do tipo: cliente, parceiros homologados, admins e funcionários da empresa',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'https://xfans-frontend.herokuapp.com',
      'https://xfans-frontend.herokuapp.com/',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      '*',
      'localhost',
      '127.0.0.1',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175',
    ],
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  setupSwagger(app);
  await app.listen(environment.app.port, () => {
    Logger.log('Listening at http://localhost:' + environment.app.port + '/');
  });
}
//
bootstrap();
