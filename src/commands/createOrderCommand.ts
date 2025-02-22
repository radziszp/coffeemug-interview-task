import { createProductBody, IOrder, Order } from '../models/orderModel';
import { IProduct, Product } from '../models/productModel';
import { ErrorHelper } from '../helpers/errorHelper';
import { decreaseProductStock } from './decreaseProductStockCommand';
import { increaseProductStock } from './increaseProductStockCommand';
import {
  CustomerLocation,
  ProductDiscountHelper
} from '../helpers/productDiscountsHelper';

export async function createOrder(body: createProductBody): Promise<IOrder> {
  const productMap = new Map(
    body.products.map((product) => [
      product.productId.toString(),
      product.quantity
    ])
  );
  let successfulUpdates: IProduct[] = [];

  try {
    const stockUpdates = body.products.map((item) =>
      decreaseProductStock(item.productId, { amount: item.quantity })
    );
    const results = await Promise.allSettled(stockUpdates);
    const failedUpdates = results.filter(
      (result) => result.status === 'rejected'
    );
    successfulUpdates = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => (result as PromiseFulfilledResult<IProduct>).value);

    if (failedUpdates.length > 0) {
      throw new ErrorHelper(
        failedUpdates.map((failed) => failed.reason).join(', '),
        400
      );
    }

    const totalPrice = await calculateTotalPrice(productMap);
    const order = new Order({ ...body, totalPrice });

    return await order.save();
  } catch (e) {
    // Since decreaseProductStock is not an external endpoint, transaction can be used instead
    // of manual rollback
    rollbackStockUpdates(successfulUpdates, productMap);
    throw e;
  }
}

export const rollbackStockUpdates = async (
  successfulUpdates: IProduct[],
  productMap: Map<string, number>
) => {
  // A retry mechanism might be helpful.
  const rollbackPromises = successfulUpdates.map((product) =>
    increaseProductStock(product._id, {
      amount: productMap.get(product._id.toString()) || 0
    })
  );

  await Promise.all(rollbackPromises);
};

export const calculateTotalPrice = async (productMap: Map<string, number>) => {
  const products = (
    await Product.find({ _id: { $in: productMap.keys().toArray() } })
  ).map((product) => ({
    ...product.toObject(),
    quantity: productMap.get(product._id.toString()) || 0
  }));

  const ProductDiscount = new ProductDiscountHelper(
    products,
    CustomerLocation.US
  );

  return ProductDiscount.getBestTotalPrice();
};
