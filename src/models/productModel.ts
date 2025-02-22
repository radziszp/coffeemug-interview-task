import { Schema, Types, model } from 'mongoose';

export enum Category {
  ELECTRONICS = 'Electronics',
  HOME = 'Home',
  SPORTS = 'Sports'
}

export interface IProduct {
  _id: Types.ObjectId;
  name: string;
  description: string;
  category: Category;
  price: number;
  stock: number;
}

export type createProductBody = Omit<IProduct, '_id'>


export interface UpdateProductStockBody {
  amount: number;
}

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 50 },
    description: { type: String, required: true, maxlength: 50 },
    category: { type: String, enum: Object.values(Category), required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true }
  },
  {
    versionKey: false
  }
);

export const Product = model('Product', ProductSchema);
