import { createProductBody, IProduct, Product } from '../models/productModel';

export async function createProduct(
  body: createProductBody
): Promise<IProduct> {
  const product = new Product(body);
  return await product.save();
}
