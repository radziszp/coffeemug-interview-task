import { Schema, Types, model } from 'mongoose';

export interface IOrder {
  _id: Types.ObjectId;
  customerId: Types.ObjectId;
  products: { productId: Types.ObjectId; quantity: number }[];
  totalPrice: number;
}

export type createProductBody = Omit<IOrder, '_id' | 'totalPrice'>;

const OrderSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, required: true },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: { type: Number, required: true, min: 1 }
      }
    ],
    totalPrice: { type: Number, required: true }
  },
  {
    versionKey: false
  }
);

export const Order = model('Order', OrderSchema);
