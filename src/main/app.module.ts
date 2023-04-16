import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from './config/environment';
import { HealthcheckController } from '../presentation/controller/healthcheck.controller';
import { RegisterController } from '../presentation/controller/register.controller';
import { RegisterService } from '../domain/usecases/register.service';
import { UserRepository } from '../data/mongoose/repositories/user.repository';
import { UserSchema, User } from '../data/mongoose/model/user.schema';
import { CryptoAdapter } from '../infra/adapters/cryptoAdapter';
import { AuthController } from '../presentation/controller/auth.controller';
import { AuthService } from '../domain/usecases/auth.service';
import { RecoveryController } from '../presentation/controller/recovery.controller';
import { RecoveryService } from '../domain/usecases/recovery.service';
import { CodeRepository } from '../data/mongoose/repositories/code.repository';
import { Code, CodeSchema } from '../data/mongoose/model/code.schema';
import { SendEmailAdapter } from '../infra/adapters/mailgun.adapter';
import { SendSmsAdapter } from '../infra/adapters/blow-io.adapter';
import { ChangePasswordService } from 'src/domain/usecases/change-password.service';

@Module({
  imports: [
    MongooseModule.forRoot(environment.mongodb.url, {
      dbName: environment.app.serviceName,
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Code.name, schema: CodeSchema },
    ]),
  ],
  providers: [
    RecoveryService,
    RegisterService,
    ChangePasswordService,
    AuthService,
    UserRepository,
    CodeRepository,
    CryptoAdapter,
    SendEmailAdapter,
    SendSmsAdapter,
  ],
  controllers: [
    RecoveryController,
    HealthcheckController,
    RegisterController,
    AuthController,
  ],
})
export class AppModule {}
