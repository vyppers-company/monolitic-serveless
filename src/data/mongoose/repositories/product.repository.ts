import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  BaseAbstractRepository,
  BaseModel,
} from '../helpers/base.abstract.repository';
import { Product, ProductDocument } from '../model/product.schema';
import { IEditProduct } from 'src/domain/entity/product';

@Injectable()
export class ProductRepository extends BaseAbstractRepository<ProductDocument> {
  constructor(
    @InjectModel(Product.name)
    private readonly product: BaseModel<ProductDocument>,
  ) {
    super(product);
  }
  async updateOne(dto: IEditProduct) {
    await this.product.updateOne(
      { _id: dto.productId, owner: dto.ownerId },
      {
        $set: {
          price: dto.price,
        },
      },
    );
  }
}
