import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { environment } from '../environment/environment';

const setupSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle(`${environment.app.serviceName}`)
    .setVersion('1.0.0')
    .addBearerAuth()
    .addGlobalParameters({
      name: 'x-profile-id',
      in: 'header',
      required: true,
      description: 'Profile ID from header',
      schema: {
        type: 'string',
      },
    })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
};

export { setupSwagger };
