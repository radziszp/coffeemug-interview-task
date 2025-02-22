import { NextFunction, Request, Response, Router } from 'express';
import { Types } from 'mongoose';
import { createProduct } from '../commands/createProductCommand';
import { getProducts } from '../queries/getProductsQuery';
import {
  productSchema,
  updateProductStockSchema
} from '../validators/productValidator';
import { increaseProductStock } from '../commands/increaseProductStockCommand';
import { decreaseProductStock } from '../commands/decreaseProductStockCommand';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await getProducts();
    return res.json(products);
  } catch (e) {
    return next(e);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = productSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res
        .status(400)
        .json({ errors: error.details.map((e) => e.message) });
    }

    const product = await createProduct(req.body);
    return res.status(201).json(product);
  } catch (e) {
    return next(e);
  }
});

router.post(
  '/:id/restock',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const { error } = updateProductStockSchema.validate(
        { id, ...req.body },
        {
          abortEarly: false
        }
      );

      if (error) {
        return res
          .status(400)
          .json({ errors: error.details.map((e) => e.message) });
      }

      const product = await increaseProductStock(new Types.ObjectId(id), req.body);

      return res.status(200).json(product);
    } catch (e) {
      return next(e);
    }
  }
);

router.post(
  '/:id/sell',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const { error } = updateProductStockSchema.validate(
        { id, ...req.body },
        {
          abortEarly: false
        }
      );

      if (error) {
        return res
          .status(400)
          .json({ errors: error.details.map((e) => e.message) });
      }

      const product = await decreaseProductStock(new Types.ObjectId(id), req.body);

      return res.status(200).json(product);
    } catch (e) {
      return next(e);
    }
  }
);

export { router };
