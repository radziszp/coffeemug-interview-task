import { Types } from 'mongoose';
import { ErrorHelper } from '../helpers/errorHelper';
import { IProduct, Product, UpdateProductStockBody } from '../models/productModel';

export async function increaseProductStock(
  id: Types.ObjectId,
  body: UpdateProductStockBody
): Promise<IProduct> {
  const product = await Product.findById(id);
  if (!product) {
    throw new ErrorHelper(`Product ${id} not found`, 404);
  }

  product.stock += body.amount;
  return await product.save();
}
