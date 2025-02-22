import request from 'supertest';
import { connectTestDB, disconnectTestDB } from './setupTestDB';
import { app } from '../src/server';
import { Category, Product } from '../src/models/productModel';
import { Order } from '../src/models/orderModel';

jest.mock('../src/helpers/databaseHelper', () => ({
  connectDB: jest.fn()
}));

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

describe('Order API Integration Tests', () => {
  let productId: string;
  let productId2: string;

  beforeEach(async () => {
    await Product.deleteMany({});

    const product = await Product.create({
      name: 'Test Product',
      description: 'Test',
      price: 100,
      stock: 10,
      category: Category.ELECTRONICS
    });

    const product2 = await Product.create({
      name: 'Test Product',
      description: 'Test',
      price: 100,
      stock: 10,
      category: Category.ELECTRONICS
    });

    productId = product._id.toString();
    productId2 = product2._id.toString();
  });

  afterEach(async () => {
    await Order.deleteMany({});
  });

  it('should create an order successfully and update stock', async () => {
    const response = await request(app)
      .post('/orders')
      .send({
        customerId: '65d9b0f0123456789abcdef2',
        products: [{ productId, quantity: 2 }]
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');

    const updatedProduct = await Product.findById(productId);
    expect(updatedProduct?.stock).toBe(8);

    const orderInDB = await Order.findOne({
      customerId: '65d9b0f0123456789abcdef2'
    });
    expect(orderInDB).not.toBeNull();
  });

  it('should fail when stock is insufficient', async () => {
    const response = await request(app)
      .post('/orders')
      .send({
        customerId: '65d9b0f0123456789abcdef2',
        products: [
          { productId, quantity: 2 },
          { productId: productId2, quantity: 20 }
        ]
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      `Error: Insufficient stock in the warehouse for product ${productId2}.`
    );

    const product = await Product.findById(productId);
    const product2 = await Product.findById(productId2);
    expect(product?.stock).toBe(10);
    expect(product2?.stock).toBe(10);
  });
});
