import { IProduct, Product } from '../models/productModel';

export async function getProducts(): Promise<IProduct[]> {
  return await Product.find();
}
