import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';

import { Config } from './config';
import { router as productsRouter } from './routes/productRoutes';
import { router as ordersRouter } from './routes/orderRoutes';
import { connectDB } from './helpers/databaseHelper';
import { errorHandler } from './middlewares/errorHandler';

const app: Express = express();
app.use(bodyParser.json());
app.use(express.json());
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(Config.port, () => {
      console.log(
        `⚡️[server]: Server is running at http://localhost:${Config.port}`
      );
    });
  } catch (err) {
    console.error(err);
  }
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export { app };
