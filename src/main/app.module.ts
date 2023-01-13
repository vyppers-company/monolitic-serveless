import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from './config/environment';
import { HealthcheckController } from '../presentation/controller/healthcheck.controller';
import { RegisterController } from '../presentation/controller/register.controller';
import { RegisterService } from '../domain/usecases/register.service';
import { RegisterRepository } from '../data/mongoose/repositories/register.repository';
import {
  BffMsRegisterSchema,
  BffMsRegister,
} from 'src/data/mongoose/model/register.schema';
import { CryptoAdapter } from 'src/infra/adapters/cryptoAdapter';

@Module({
  imports: [
    MongooseModule.forRoot(environment.mongodb.url, {
      dbName: environment.mongodb.db,
    }),
    MongooseModule.forFeature([
      { name: BffMsRegister.name, schema: BffMsRegisterSchema },
    ]),
  ],
  providers: [RegisterService, RegisterRepository, CryptoAdapter],
  controllers: [HealthcheckController, RegisterController],
})
export class AppModule {}
