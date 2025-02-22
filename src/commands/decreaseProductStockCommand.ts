import { Types } from 'mongoose';
import { ErrorHelper } from '../helpers/errorHelper';
import { IProduct, Product, UpdateProductStockBody } from '../models/productModel';

export async function decreaseProductStock(
  id: Types.ObjectId,
  body: UpdateProductStockBody
): Promise<IProduct> {
  let product = await Product.findById(id);
  if (!product) {
    throw new ErrorHelper(`Product ${id} not found`, 404);
  }

  product = await Product.findOneAndUpdate(
    { _id: id, stock: { $gte: body.amount } },
    { $inc: { stock: -body.amount } },
    { new: true } 
  );

  if (!product) {
    throw new ErrorHelper(`Insufficient stock in the warehouse for product ${id}.`, 400);
  }

  return product;
}
