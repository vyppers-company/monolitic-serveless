import { IPurchaseproductProcess } from 'src/presentation/dtos/purchase-product.dto';
import { IPaymentIntentResponse } from './payment-method.interface';

export interface IPurchaseProductUseCase {
  processPurchase: (
    userId: string,
    dto: IPurchaseproductProcess,
  ) => Promise<IPaymentIntentResponse>;
}
