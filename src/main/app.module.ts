import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from './config/environment/environment';
import { HealthcheckController } from '../presentation/controller/healthcheck.controller';
import { RegisterController } from '../presentation/controller/register.controller';
import { RegisterService } from '../domain/usecases/register.service';
import { UserRepository } from '../data/mongoose/repositories/user.repository';
import { UserSchema, User } from '../data/mongoose/model/user.schema';
import { CryptoAdapter } from '../infra/adapters/crypto/cryptoAdapter';
import { AuthController } from '../presentation/controller/auth.controller';
import { AuthService } from '../domain/usecases/auth.service';
import { RecoveryController } from '../presentation/controller/recovery.controller';
import { RecoveryService } from '../domain/usecases/recovery.service';
import { CodeRepository } from '../data/mongoose/repositories/code.repository';
import { Code, CodeSchema } from '../data/mongoose/model/code.schema';
import { SendSmsAdapter } from '../infra/adapters/aws/sns/blow-io.adapter';
import { ChangePasswordService } from 'src/domain/usecases/change-password.service';
import { ValidateCodeService } from 'src/domain/usecases/validate-code.service';
import { UserController } from 'src/presentation/controller/user.controller';
import { ValidateDataService } from 'src/domain/usecases/validate-profile-id.service';
import { GoogleAuthStrategy } from 'src/domain/usecases/google-strategy.service';
import { FacebookAuthStrategy } from 'src/domain/usecases/facebook-strategy.service';
import { SESAdapter } from 'src/infra/adapters/aws/ses/ses.adapter';
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
import { Plan, PlanSchema } from 'src/data/mongoose/model/plan.schema';
import { PlanService } from 'src/domain/usecases/plan.service';
import { PlanRepository } from 'src/data/mongoose/repositories/plan.repository';
import { PlanController } from 'src/presentation/controller/plan.controller';
import { PaymentSubscriptionAdapter } from 'src/infra/adapters/payment/subscription/subscription.adapter';
import { SubscriptionController } from 'src/presentation/controller/subscription.controller';
import { SubscriptionService } from 'src/domain/usecases/subscription.service';
import Stripe from 'stripe';
import { PaymentPlanAdapter } from 'src/infra/adapters/payment/plan/plan.adapter';
import { PaymentCustomerAdapter } from 'src/infra/adapters/payment/customer/customer.adapter';
import { SetupIntentAdapter } from 'src/infra/adapters/payment/setup/setIntent.adapter';
import { PaymentMethodController } from 'src/presentation/controller/payment-method.controller';
import { PaymentMethodsService } from 'src/domain/usecases/payment-method.service';
import { PaymentMethodAdapter } from 'src/infra/adapters/payment/payment-methods/payment-methods.adapter';
import { Payment, PaymentSchema } from 'src/data/mongoose/model/payment.schema';
import { PaymentRepository } from 'src/data/mongoose/repositories/payment.repository';
import { Product, ProductSchema } from 'src/data/mongoose/model/product.schema';
import { ProductRepository } from 'src/data/mongoose/repositories/product.repository';
import {
  VerifiDocumentsSchema,
  VerifyDocuments,
} from 'src/data/mongoose/model/verify-documents.schema';
import { VerifyDocumentsRepository } from 'src/data/mongoose/repositories/verify-documents.repository';
import { VerifyDocumentsController } from 'src/presentation/controller/verify-documents';
import { VerifyDocumentsService } from 'src/domain/usecases/verify-documents.service';
import { InternalUserRepository } from '../data/mongoose/repositories/internal-user.repository';
import {
  InternalUser,
  InternalUserSchema,
} from '../data/mongoose/model/internal-users';
import { RegisterInternalUserService } from 'src/domain/usecases/register-internal-user.service';
import { AuthInternalUserService } from 'src/domain/usecases/auth-internal-user.service';
import { VerifyDocumentsInternalService } from 'src/domain/usecases/verify-documents-internal.service';
import { VerifyDocumentsInternalController } from 'src/presentation/controller/internal-verify.controller';
import { DenunciateController } from 'src/presentation/controller/denunciate.controller';
import { DenunciateService } from 'src/domain/usecases/denunciate.service';
import {
  Denunciate,
  denunciateSchema,
} from 'src/data/mongoose/model/denunciate.schema';
import { DenunciateRepository } from 'src/data/mongoose/repositories/denunciate.repository';
@Module({
  imports: [
    MongooseModule.forRoot(environment.mongodb.url, {
      dbName: environment.app.serviceName,
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Code.name, schema: CodeSchema },
      { name: Content.name, schema: ContentSchema },
      { name: Plan.name, schema: PlanSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Product.name, schema: ProductSchema },
      { name: VerifyDocuments.name, schema: VerifiDocumentsSchema },
      { name: InternalUser.name, schema: InternalUserSchema },
      { name: Denunciate.name, schema: denunciateSchema },
    ]),
  ],
  providers: [
    {
      provide: 'stripe',
      useValue: new Stripe(environment.payment.stripe.secretKey),
    },
    FacebookAuthStrategy,
    GoogleAuthStrategy,
    ContentRepository,
    UserRepository,
    CodeRepository,
    DenunciateRepository,
    PlanRepository,
    PaymentRepository,
    ProductRepository,
    VerifyDocumentsRepository,
    InternalUserRepository,
    VerifyDocumentsInternalService,
    RegisterInternalUserService,
    AuthInternalUserService,
    SubscriptionService,
    RecoveryService,
    RegisterService,
    ChangePasswordService,
    AuthService,
    ValidateCodeService,
    UpdateProfileService,
    MakeLikeService,
    ValidateDataService,
    CreateContentService,
    DeleteContentService,
    RegisterMinimalService,
    EditContentService,
    PlanService,
    GetContentService,
    GetProfileService,
    S3Service,
    FeedService,
    SearchUsersService,
    BanUserService,
    FollowService,
    ValidateMissingDataProfileService,
    PaymentMethodsService,
    VerifyDocumentsService,
    DenunciateService,
    CryptoAdapter,
    SESAdapter,
    SendSmsAdapter,
    PaymentSubscriptionAdapter,
    PaymentPlanAdapter,
    PaymentCustomerAdapter,
    SetupIntentAdapter,
    PaymentMethodAdapter,
  ],
  controllers: [
    PaymentMethodController,
    PlanController,
    SubscriptionController,
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
    VerifyDocumentsController,
    VerifyDocumentsInternalController,
    DenunciateController,
  ],
})
export class AppModule {}
