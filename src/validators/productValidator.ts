import Joi from 'joi';
import mongoose from 'mongoose';

import { Category } from '../models/productModel';

export const productSchema = Joi.object({
  name: Joi.string().max(50).required(),
  description: Joi.string().max(50).required(),
  category: Joi.string()
    .valid(...Object.values(Category))
    .required(),
  price: Joi.number().integer().positive().required(),
  stock: Joi.number().integer().min(0).required()
});

export const updateProductStockSchema = Joi.object({
  id: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'MongoDB ObjectId validation')
    .required()
    .messages({ 'any.invalid': 'Invalid product ID' }),
  amount: Joi.number().integer().positive().required()
});
