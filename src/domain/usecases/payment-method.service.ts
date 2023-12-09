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
import { CryptoAdapter } from 'src/infra/adapters/crypto/cryptoAdapter';
import { ICryptoType } from '../interfaces/adapters/crypto.interface';
import { IPaymentConfiguration } from '../entity/payment';
import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { PaymentRepository } from 'src/data/mongoose/repositories/payment.repository';

@Injectable()
export class PaymentMethodsService implements IPaymentMethodUseCases {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentCustomerAdapter: PaymentCustomerAdapter,
    private readonly setupIntentAdapter: SetupIntentAdapter,
    private readonly paymentMethodAdapter: PaymentMethodAdapter,
    private readonly cryptoAdapter: CryptoAdapter,
  ) {}
  async createSetupIntent(myId: string): Promise<ISetupIntentSecret> {
    const existentUser = await this.userRepository.findOne(
      {
        _id: myId,
      },
      null,
      {
        lean: true,
        populate: [
          {
            model: 'Payment',
            path: 'paymentConfiguration',
          },
        ],
      },
    );

    if (!existentUser.paymentConfiguration) {
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

      const newPayment = await this.paymentRepository.create({
        owner: myId,
        customerId: paymentCustomer,
      });

      await this.userRepository.updatePaymentId(
        String(existentUser._id),
        String(newPayment._id),
      );

      return setupIntent;
    }

    const existentPayment =
      existentUser.paymentConfiguration as IPaymentConfiguration;

    const paymentMethods = await this.paymentMethodAdapter.getPaymentMethods(
      existentPayment.customerId,
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

    const setup = await this.setupIntentAdapter.createSetupIntent(
      existentPayment.customerId,
    );

    return setup;
  }

  async getPaymentMethods(
    myVypperId: string,
  ): Promise<IPaymentConfiguration['paymentMethods']> {
    const existentUser = await this.userRepository.findOne(
      { _id: myVypperId },
      null,
      {
        lean: true,
        populate: [
          {
            path: 'paymentConfiguration',
            model: 'Payment',
          },
        ],
      },
    );
    if (!existentUser) {
      throw new HttpException(
        {
          message: 'User is not found',
          reason: 'UserNotFound',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const paymentConfiguration =
      existentUser.paymentConfiguration as IPaymentConfiguration;

    if (!paymentConfiguration) {
      throw new HttpException(
        {
          message: 'You dont have any payment method yet',
          reason: 'NotHaveCards',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const payments = await this.paymentMethodAdapter.getPaymentMethods(
      paymentConfiguration.customerId,
    );

    const defaultPayment = paymentConfiguration.paymentMethods.find(
      (pay) => pay.isDefault === true,
    );

    const finalDto = payments.map((pay) => ({
      ...pay,
      isDefault: defaultPayment?.id === pay.id ? true : false,
    }));

    await this.paymentRepository.updateMethods(
      paymentConfiguration._id,
      finalDto,
    );

    return finalDto;
  }

  async setAsDefault(myId: string, paymentMethodId: string): Promise<void> {
    const paymentConfiguration = await this.paymentRepository.findOne({
      owner: myId,
    });
    if (!paymentConfiguration) {
      throw new HttpException(
        {
          reason: 'PaymentMethodError',
          message: 'Not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.paymentCustomerAdapter.setDefaultCard(
      paymentConfiguration.customerId,
      paymentMethodId,
    );

    const methods = paymentConfiguration.paymentMethods.map((method) => ({
      ...method,
      isDefault: method.id === paymentMethodId ? true : false,
    }));

    await this.paymentRepository.updateMethods(
      paymentConfiguration._id,
      methods,
    );
  }

  async deletePaymentMethod(
    myId: string,
    paymentMethodId: string,
  ): Promise<IResponseDeleteCardDefault> {
    const user = await this.userRepository.findOne(
      {
        owner: myId,
      },
      null,
      {
        lean: true,
        populate: [{ path: 'paymentConfiguration', model: 'Payment' }],
      },
    );

    if (!user) {
      throw new HttpException(
        {
          reason: 'PaymentMethodError',
          message: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const paymentConfiguration =
      user.paymentConfiguration as IPaymentConfiguration;

    if (!paymentConfiguration) {
      throw new HttpException(
        {
          reason: 'PaymentMethodError',
          message: 'You dont have any payment methods to delete',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.paymentMethodAdapter.deletePaymentMethod(
      paymentConfiguration.customerId,
      paymentMethodId,
    );

    const payments = paymentConfiguration.paymentMethods.filter(
      (pay) => pay.id !== paymentMethodId,
    );

    await this.paymentRepository.updateMethods(
      paymentConfiguration._id,
      payments,
    );

    return {
      reason: 'PaymentMethodSuccess',
      message: 'Needs to set another card as default',
    };
  }
}
