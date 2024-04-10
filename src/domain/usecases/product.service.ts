import { Injectable } from '@nestjs/common';
import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { ProductRepository } from 'src/data/mongoose/repositories/product.repository';
import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { PaymentProductAdapter } from 'src/infra/adapters/payment/product/product.adapter';
import { IProductUseCase } from '../interfaces/usecases/product.interface';

@Injectable()
export class ProductService implements IProductUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly contentRepository: ContentRepository,
    private readonly productRepository: ProductRepository,
    private readonly productPaymentAdapter: PaymentProductAdapter,
  ) {}
  async createProductByUser(userId: string, product: any): Promise<void> {
    return;
  }
  deleteProductByUser: (userId: string, productId: string) => Promise<any>;
  getProductByUser: (userId: string, productId: string) => Promise<any>;
  getProductsByUser: (userId: string) => Promise<any>;
  updateProductByUser: (userId: string, productBody: any) => Promise<any>;

  createProductBySystem: (systemId: string, productBody: any) => Promise<void>;
  deleteProductBySystem: (systemId: string, productId: string) => Promise<any>;
  getProductBySystem: (systemId: string, productId: string) => Promise<any>;
  getProductsBySystem: (systemId: string) => Promise<any>;
  updateProductBySystem: (systemId: string, productBody: any) => Promise<any>;
}
