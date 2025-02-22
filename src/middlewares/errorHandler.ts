import { NextFunction, Request, Response } from 'express';
import { ErrorHelper } from '../helpers/errorHelper';

export const errorHandler = (
  err: unknown,
  _: Request,
  res: Response,
  _2: NextFunction
) => {
  if (err instanceof ErrorHelper) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error('Unexpected error', err);
  return res.status(500).json({ error: 'Internal server error.' });
};
