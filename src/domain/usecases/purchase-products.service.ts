import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IPurchaseProductUseCase } from '../interfaces/usecases/purchase-product.interface';
import { PaymentProductAdapter } from 'src/infra/adapters/payment/product/product.adapter';
import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { ProductRepository } from 'src/data/mongoose/repositories/product.repository';
import { IPurchaseproductProcess } from 'src/presentation/dtos/purchase-product.dto';
import { IntentAdapter } from 'src/infra/adapters/payment/intents/intents.adapter';
import { ICurrency } from '../entity/currency';
import { IPaymentConfiguration } from '../entity/payment';
import { TransactionRepository } from 'src/data/mongoose/repositories/transaction.repository';
import { MyPurchasesRepository } from 'src/data/mongoose/repositories/my-purchases.repository';

@Injectable()
export class PurchaseProductService implements IPurchaseProductUseCase {
  constructor(
    private readonly intentPaymentAdapter: IntentAdapter,
    private readonly userRepository: UserRepository,
    private readonly productRepository: ProductRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly myPurchasesRepository: MyPurchasesRepository,
  ) {}
  async processPurchase(buyerId: string, dto: IPurchaseproductProcess) {
    if (buyerId === dto.creatorVypperId) {
      throw new HttpException(
        'You cant buy your own content',
        HttpStatus.CONFLICT,
      );
    }
    const creator = await this.userRepository.findOne(
      {
        _id: dto.creatorVypperId,
      },
      null,
      { lean: true },
    );

    if (!creator) {
      throw new HttpException('creator not found', HttpStatus.NOT_FOUND);
    }
    const product = await this.productRepository.findOne(
      { _id: dto.productId },
      null,
      { lean: true },
    );
    if (!product) {
      throw new HttpException('product not found', HttpStatus.NOT_FOUND);
    }
    if (String(product.owner) !== String(creator._id)) {
      throw new HttpException(
        'product and creator conflict',
        HttpStatus.CONFLICT,
      );
    }
    if (!product.activated || !product.idAdapter) {
      throw new HttpException(
        'product is not available to buy',
        HttpStatus.FORBIDDEN,
      );
    }
    const buyerUser = await this.userRepository.findOne(
      { _id: buyerId },
      null,
      { populate: [{ path: 'paymentConfiguration', model: 'Payment' }] },
    );
    if (!buyerUser.paymentConfiguration) {
      throw new HttpException(
        'configure a new payment method before',
        HttpStatus.NOT_FOUND,
      );
    }
    const paymentMethods =
      buyerUser.paymentConfiguration as IPaymentConfiguration;
    const defaultPayment = paymentMethods.paymentMethods.find(
      (paymentMethod) => paymentMethod.isDefault,
    );
    if (!defaultPayment) {
      throw new HttpException(
        'need to set a default payment method',
        HttpStatus.FORBIDDEN,
      );
    }
    const intentToPay = await this.intentPaymentAdapter.createPaymentIntent({
      currency: ICurrency.BRL,
      contentId: product.content,
      customerPaymentId: paymentMethods.customerId,
      ownerId: dto.creatorVypperId,
      price: product.price,
      productId: product._id,
      productAdapterId: product.idAdapter,
      paymentmethodId: defaultPayment.id,
    });

    if (intentToPay) {
      await this.transactionRepository.create({
        buyer: buyerId,
        idTransactionAdapter: intentToPay.transactionId,
        plataformPercentage: 5, //needs to be transfer to entity
        sellerPercentage: 95, //needs to be transfer to entity
        productId: product._id,
        seller: dto.creatorVypperId,
      });

      const purchases = await this.myPurchasesRepository.findOne({
        owner: buyerId,
      });

      if (!purchases) {
        await this.myPurchasesRepository.create({
          owner: buyerId,
          contents: [product.content],
        });
        return intentToPay;
      }

      await this.myPurchasesRepository.addPurchase(buyerId, product.content);

      return intentToPay;
    }
    throw new HttpException(
      'was not possible to conclude the purchase, please try again or getting in contact',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
