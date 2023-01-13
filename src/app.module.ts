import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from './main/config/environment';
import { HealthcheckController } from './presentation/controller/healthcheck.controller';

@Module({
  imports: [
    MongooseModule.forRoot(environment.mongodb.url, {
      dbName: environment.mongodb.db,
    }),
  ],
  controllers: [HealthcheckController],
})
export class AppModule {}
