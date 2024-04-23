import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  BaseAbstractRepository,
  BaseModel,
} from '../helpers/base.abstract.repository';
import { MyPurchases, MyPurchasesDocument } from '../model/purchase.schema';

@Injectable()
export class MyPurchasesRepository extends BaseAbstractRepository<MyPurchasesDocument> {
  constructor(
    @InjectModel(MyPurchases.name)
    private readonly purchases: BaseModel<MyPurchasesDocument>,
  ) {
    super(purchases);
  }

  async addPurchase(owner: string, content: string) {
    await this.purchases.updateOne({ owner }, { $push: { contents: content } });
  }
}
