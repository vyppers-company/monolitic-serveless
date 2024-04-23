import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  BaseAbstractRepository,
  BaseModel,
} from '../helpers/base.abstract.repository';
import { Transaction, TransactionDocument } from '../model/transactions.schema';

@Injectable()
export class TransactionRepository extends BaseAbstractRepository<TransactionDocument> {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transaction: BaseModel<TransactionDocument>,
  ) {
    super(transaction);
  }
}
