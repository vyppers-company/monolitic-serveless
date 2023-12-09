import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  BaseAbstractRepository,
  BaseModel,
} from '../helpers/base.abstract.repository';
import { Product, ProductDocument } from '../model/product.schema';

@Injectable()
export class ProductRepository extends BaseAbstractRepository<ProductDocument> {
  constructor(
    @InjectModel(Product.name)
    private readonly product: BaseModel<ProductDocument>,
  ) {
    super(product);
  }
}
