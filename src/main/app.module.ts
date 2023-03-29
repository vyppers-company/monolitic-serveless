import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from './config/environment';
import { HealthcheckController } from '../presentation/controller/healthcheck.controller';
import { RegisterController } from '../presentation/controller/register.controller';
import { RegisterService } from '../domain/usecases/register.service';
import { UserRepository } from '../data/mongoose/repositories/user.repository';
import { UserSchema, User } from 'src/data/mongoose/model/user.schema';
import { CryptoAdapter } from 'src/infra/adapters/cryptoAdapter';
import { AuthController } from 'src/presentation/controller/auth.controller';
import { AuthService } from 'src/domain/usecases/auth.service';

@Module({
  imports: [
    MongooseModule.forRoot(environment.mongodb.url, {
      dbName: environment.mongodb.db,
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [RegisterService, UserRepository, CryptoAdapter, AuthService],
  controllers: [HealthcheckController, RegisterController, AuthController],
})
export class AppModule {}
