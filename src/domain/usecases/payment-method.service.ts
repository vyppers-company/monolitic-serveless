import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaymentCustomerAdapter } from 'src/infra/adapters/payment/customer/customer.adapter';
import { SetupIntentAdapter } from 'src/infra/adapters/payment/setup/setIntent.adapter';
import {
  ISetupIntentSecret,
  IPaymentMethodUseCases,
  IPaymentMethodsList,
  IResponseDeleteCardDefault,
} from '../interfaces/usecases/payment-method.interface';
import { PaymentMethodAdapter } from 'src/infra/adapters/payment/payment-methods/payment-methods.adapter';
import { CryptoAdapter } from 'src/infra/adapters/cryptoAdapter';
import { ICryptoType } from '../interfaces/adapters/crypto.interface';

@Injectable()
export class PaymentMethodsService implements IPaymentMethodUseCases {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly paymentCustomerAdapter: PaymentCustomerAdapter,
    private readonly setupIntentAdapter: SetupIntentAdapter,
    private readonly paymentMethodAdapter: PaymentMethodAdapter,
    private readonly cryptoAdapter: CryptoAdapter,
  ) {}
  async createSetupIntent(myId: string): Promise<ISetupIntentSecret> {
    const existentUser = await this.userRepository.findOneById(myId);
    if (!existentUser) {
      throw new HttpException(
        { message: 'User Not Found', reason: 'UserNotFound' },
        HttpStatus.CONFLICT,
      );
    }
    if (existentUser?.paymentConfiguration?.paymentCustomerId) {
      const paymentMethods = await this.paymentMethodAdapter.getPaymentMethods(
        existentUser.paymentConfiguration.paymentCustomerId,
      );

      if (paymentMethods.length >= 3) {
        throw new HttpException(
          {
            message: 'You reach the limit of payment methods, the limit is 3',
            reason: 'CreateLimitCard',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.setupIntentAdapter.createSetupIntent(
        existentUser?.paymentConfiguration?.paymentCustomerId,
      );
    }

    const unhashedEmail = existentUser.email
      ? this.cryptoAdapter.decryptText(existentUser.email, ICryptoType.USER)
      : null;
    const unhashedEPhone = existentUser.phone
      ? this.cryptoAdapter.decryptText(existentUser.phone, ICryptoType.USER)
      : null;

    const paymentCustomer = await this.paymentCustomerAdapter.createCustomer({
      email: unhashedEmail,
      phone: unhashedEPhone,
      name: existentUser.name,
      vypperId: existentUser.vypperId,
      _id: existentUser._id,
    });
    const setupIntent = await this.setupIntentAdapter.createSetupIntent(
      paymentCustomer,
    );
    await this.userRepository.updatePaymentId(
      String(existentUser._id),
      paymentCustomer,
    );
    return setupIntent;
  }

  async getPaymentMethods(myVypperId: string): Promise<IPaymentMethodsList[]> {
    const existentUser = await this.userRepository.findOneById(myVypperId);
    if (!existentUser) {
      throw new HttpException(
        {
          message: 'User is not found',
          reason: 'UserNotFound',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    if (!existentUser.paymentConfiguration.paymentCustomerId) {
      throw new HttpException(
        {
          message: 'You dont have any payment method yet',
          reason: 'NotHaveCards',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.paymentMethodAdapter.getPaymentMethods(
      existentUser.paymentConfiguration.paymentCustomerId,
    );
  }
  async setAsDefault(myId: string, paymentMethodId: string): Promise<void> {
    const user = await this.userRepository.findOneById(myId);
    if (!user) {
      throw new HttpException(
        {
          reason: 'PaymentMethodError',
          message: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    if (!user.paymentConfiguration.paymentCustomerId) {
      throw new HttpException(
        {
          reason: 'PaymentMethodError',
          message: 'You dont have any payment methods to set as default',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.paymentCustomerAdapter.setDefaultCard(
      user.paymentConfiguration.paymentCustomerId,
      paymentMethodId,
    );
  }
  async deletePaymentMethod(
    myId: string,
    paymentMethodId: string,
  ): Promise<IResponseDeleteCardDefault> {
    const user = await this.userRepository.findOneById(myId);
    if (!user) {
      throw new HttpException(
        {
          reason: 'PaymentMethodError',
          message: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    if (!user.paymentConfiguration.paymentCustomerId) {
      throw new HttpException(
        {
          reason: 'PaymentMethodError',
          message: 'You dont have any payment methods to delete',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.paymentMethodAdapter.deletePaymentMethod(myId, paymentMethodId);
    return {
      reason: 'PaymentMethodSuccess',
      message: 'Needs to set another card as default',
    };
  }
}
