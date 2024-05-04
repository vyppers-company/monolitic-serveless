import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { environment } from '../../config/environment/environment';
import { enableCors } from '../../config/cors';
import { setupSwagger } from '../../config/swagger';
import * as mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { HttpExceptionFilter } from 'src/shared/filters/http-exception.filter';
async function bootstrapServer() {
  mongoose.plugin(mongoosePaginate);
  const app = await NestFactory.create(AppModule, { rawBody: true });
  enableCors(app);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  setupSwagger(app);
  await app.listen(environment.app.port, () => {
    Logger.log('Listening at http://localhost:' + environment.app.port + '/');
  });
}
export { bootstrapServer };
