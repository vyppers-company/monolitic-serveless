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
import { SendSmsAdapter } from '../infra/adapters/blow-io.adapter';
import { ChangePasswordService } from 'src/domain/usecases/change-password.service';
import { ValidateCodeService } from 'src/domain/usecases/validate-code.service';
import { UserController } from 'src/presentation/controller/user.controller';
import { ValidateDataService } from 'src/domain/usecases/validate-profile-id.service';
import { GoogleAuthStrategy } from 'src/domain/usecases/google-strategy.service';
import { FacebookAuthStrategy } from 'src/domain/usecases/facebook-strategy.service';
import { SESAdapter } from 'src/infra/adapters/ses.adapter';
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
import { RegisterMinimalService } from 'src/domain/usecases/register-minimal.service';
import { MakeLikeService } from 'src/domain/usecases/make-like.service';
import { ReactionsController } from 'src/presentation/controller/make-like.controller';
import { FeedService } from 'src/domain/usecases/feed.service';
import { UpdateProfileService } from 'src/domain/usecases/update-profile.service';
import { SearchController } from 'src/presentation/controller/search.controller';
import { SearchUsersService } from 'src/domain/usecases/search.service';
import { ValidateMissingDataProfileService } from 'src/domain/usecases/validate-missing-profile-data.service';
import { BanUserService } from 'src/domain/usecases/ban-user.service';
import { BanUserController } from 'src/presentation/controller/ban-user.controller';
import { FollowersControllers } from 'src/presentation/controller/followers.controller';
import { FollowService } from 'src/domain/usecases/follow.service';

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
    SESAdapter,
    UpdateProfileService,
    SendSmsAdapter,
    MakeLikeService,
    ValidateDataService,
    CreateContentService,
    DeleteContentService,
    RegisterMinimalService,
    EditContentService,
    GetContentService,
    ContentRepository,
    GetProfileService,
    S3Service,
    FeedService,
    SearchUsersService,
    BanUserService,
    FollowService,
    ValidateMissingDataProfileService,
  ],
  controllers: [
    SearchController,
    FollowersControllers,
    RecoveryController,
    HealthcheckController,
    RegisterController,
    AuthController,
    UserController,
    ContentController,
    BanUserController,
    UploadController,
    ReactionsController,
  ],
})
export class AppModule {}
