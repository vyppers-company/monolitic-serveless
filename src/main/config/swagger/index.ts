import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { environment } from '../environment/environment';

const setupSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle(`${environment.app.serviceName}`)
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  const bearerAuthRoutes = Object.keys(document.paths)
    .filter((key) => document.paths[key])
    .map((key) => {
      const path = document.paths[key];
      const firstField = Object.values(path)[0];
      return firstField;
    })
    .filter(
      (route) =>
        route.security && route.security.some((security) => security.bearer),
    );

  bearerAuthRoutes.forEach((route) => {
    const parameters = route.parameters || [];
    parameters.push({
      name: 'x-profile-id',
      in: 'header',
      required: true,
      schema: {
        type: 'string',
      },
      description: 'Profile ID from header',
    });
    route.parameters = parameters;
  });

  SwaggerModule.setup('swagger', app, document);
};

export { setupSwagger };
