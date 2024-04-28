import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { IEditContentUseCase } from '../interfaces/usecases/edit-content.interface';
import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { IEditContentDtoExtended } from 'src/presentation/dtos/edit-content.dto';
import { PaymentProductAdapter } from 'src/infra/adapters/payment/product/product.adapter';
import { ProductRepository } from 'src/data/mongoose/repositories/product.repository';

@Injectable()
export class EditContentService implements IEditContentUseCase {
  constructor(
    private readonly contentRepository: ContentRepository,
    private readonly paymentStripeProduct: PaymentProductAdapter,
    private readonly productRepository: ProductRepository,
  ) {}
  async editContent(dto: IEditContentDtoExtended): Promise<void> {
    const content = await this.contentRepository.findOne({
      _id: dto.contentId,
      owner: dto.owner,
      isDeleted: false,
    });
    if (!content) {
      throw new HttpException(
        {
          message: 'Not found content',
          reason: 'ContentError',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.contentRepository.updateOne({
      contentId: content._id,
      plans: dto.plans,
      text: dto.text,
      owner: dto.owner,
    });
    const product = await this.productRepository.findOne({
      _id: content.productId,
      owner: dto.owner,
    });
    if (product) {
      await this.productRepository.updateOne({
        productId: product._id,
        ownerId: product.owner,
        price: dto.product.price,
      });
      await this.paymentStripeProduct.updateProduct({
        id: product.idAdapter,
        price: dto.product.price,
      });
    }
  }
}
