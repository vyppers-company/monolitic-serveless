import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  BaseAbstractRepository,
  BaseModel,
} from '../helpers/base.abstract.repository';
import { Payment, PaymentDocument } from '../model/payment.schema';
import { IPaymentConfiguration } from 'src/domain/entity/payment';

@Injectable()
export class PaymentRepository extends BaseAbstractRepository<PaymentDocument> {
  constructor(
    @InjectModel(Payment.name)
    private readonly payment: BaseModel<PaymentDocument>,
  ) {
    super(payment);
  }

  async updateMethods(
    paymentId: string,
    payments: IPaymentConfiguration['paymentMethods'],
  ) {
    await this.payment.updateOne(
      { _id: paymentId },
      {
        $set: {
          paymentMethods: payments,
        },
      },
    );
  }
}
