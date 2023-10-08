import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from './config/environment/environment';
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
import { ValidateCodeService } from 'src/domain/usecases/validate-code.service';
import { UserController } from 'src/presentation/controller/user.controller';
import { ValidateProfileIdService } from 'src/domain/usecases/validate-profile-id.service';
import { GoogleAuthStrategy } from 'src/domain/usecases/google-strategy.service';
import { FacebookAuthStrategy } from 'src/domain/usecases/facebook-strategy.service';
import { SESAdapter } from 'src/infra/adapters/ses.adapter';
import { GoogleStorageMulter } from 'src/shared/helpers/google-storage-multer';
import { CreateContentService } from 'src/domain/usecases/create-content.service';
import { DeleteContentService } from 'src/domain/usecases/delete-content.service';
import { EditContentService } from 'src/domain/usecases/edit-content.service';
import { GetContentService } from 'src/domain/usecases/get-content.service';
import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { Content, ContentSchema } from 'src/data/mongoose/model/content.schema';
import { GetProfileService } from 'src/domain/usecases/get-profile.service';
import { ContentController } from 'src/presentation/controller/content.controller';
import { UploadController } from 'src/presentation/controller/uploads.controller';
import { S3Service } from 'src/domain/usecases/s3-upload.service';

@Module({
  imports: [
    MongooseModule.forRoot(environment.mongodb.url, {
      dbName: environment.app.serviceName,
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Code.name, schema: CodeSchema },
      { name: Content.name, schema: ContentSchema },
    ]),
  ],
  providers: [
    {
      provide: 'UPLOAD',
      useFactory: () => {
        return new GoogleStorageMulter({
          bucketName: environment.storage.bucket.name,
          client_email: environment.storage.client_email,
          private_key: environment.storage.private_key.replace(/\\n/g, '\n'),
        });
      },
    },
    FacebookAuthStrategy,
    GoogleAuthStrategy,
    RecoveryService,
    RegisterService,
    ChangePasswordService,
    AuthService,
    ValidateCodeService,
    UserRepository,
    CodeRepository,
    CryptoAdapter,
    SendEmailAdapter,
    SESAdapter,
    SendSmsAdapter,
    ValidateProfileIdService,
    CreateContentService,
    DeleteContentService,
    EditContentService,
    GetContentService,
    ContentRepository,
    GetProfileService,
    S3Service,
  ],
  controllers: [
    RecoveryController,
    HealthcheckController,
    RegisterController,
    AuthController,
    UserController,
    ContentController,
    UploadController,
  ],
})
export class AppModule {}
