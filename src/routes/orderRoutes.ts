import { NextFunction, Request, Response, Router } from 'express';
import { orderSchema } from '../validators/orderValidator';
import { createOrder } from '../commands/createOrderCommand';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = orderSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res
        .status(400)
        .json({ errors: error.details.map((e) => e.message) });
    }

    const order = await createOrder(req.body);
    return res.status(201).json(order);
  } catch (e) {
    return next(e);
  }
});

export { router };
