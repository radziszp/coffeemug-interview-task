import Joi from 'joi';
import mongoose from 'mongoose';

export const orderSchema = Joi.object({
  customerId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'MongoDB ObjectId validation')
    .required()
    .messages({ 'any.invalid': 'Invalid customer ID' }),
  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string()
          .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
              return helpers.error('any.invalid');
            }
            return value;
          }, 'MongoDB ObjectId validation')
          .required()
          .messages({ 'any.invalid': 'Invalid product ID' }),
        quantity: Joi.number().integer().min(1).required()
      })
    )
    .unique((a, b) => a.productId === b.productId)
    .messages({ 'array.unique': 'ProductId has to be unique' })
    .min(1)
    .required()
});
