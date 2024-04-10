export interface IProductUseCase {
  createProductByUser: (userId: string, productBody: any) => Promise<void>;
  getProductByUser: (userId: string, productId: string) => Promise<any>;
  getProductsByUser: (userId: string) => Promise<any>;
  deleteProductByUser: (userId: string, productId: string) => Promise<any>;
  updateProductByUser: (userId: string, productBody: any) => Promise<any>;

  createProductBySystem: (systemId: string, productBody: any) => Promise<void>;
  getProductBySystem: (systemId: string, productId: string) => Promise<any>;
  getProductsBySystem: (systemId: string) => Promise<any>;
  deleteProductBySystem: (systemId: string, productId: string) => Promise<any>;
  updateProductBySystem: (systemId: string, productBody: any) => Promise<any>;
}
