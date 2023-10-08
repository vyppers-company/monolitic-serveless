import { INestApplication } from '@nestjs/common';
import { environment } from '../environment/environment';

const enableCors = (app: INestApplication) =>
  app.enableCors({
    origin: environment.app.cors,
  });
export { enableCors };
