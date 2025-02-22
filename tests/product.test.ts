import request from 'supertest';
import { connectTestDB, disconnectTestDB } from './setupTestDB';
import { app } from '../src/server';
import { Category, Product } from '../src/models/productModel';
import { Order } from '../src/models/orderModel';
import { Types } from 'mongoose';

jest.mock('../src/helpers/databaseHelper', () => ({
  connectDB: jest.fn()
}));

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

describe('Product API Integration Tests', () => {
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

  it('should return list of products', async () => {
    const response = await request(app).get('/products').send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ _id: productId }),
        expect.objectContaining({ _id: productId2 })
      ])
    );
  });

  it('should create a product', async () => {
    const response = await request(app).post('/products').send({
      name: 'Test Product',
      description: 'Test',
      price: 100,
      stock: 10,
      category: Category.ELECTRONICS
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
  });

  it('should increase product stock', async () => {
    const response = await request(app)
      .post(`/products/${productId}/restock`)
      .send({
        amount: 10
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');

    const product = await Product.findById(productId);
    expect(product?.stock).toBe(20);
  });

  it('should fail to increase product when product not found', async () => {
    const id = new Types.ObjectId().toString();
    const response = await request(app).post(`/products/${id}/restock`).send({
      amount: 10
    });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(`Product ${id} not found`);
  });

  it('should decrease product stock', async () => {
    const response = await request(app)
      .post(`/products/${productId}/sell`)
      .send({
        amount: 10
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');

    const product = await Product.findById(productId);
    expect(product?.stock).toBe(0);
  });

  it('should fail to decrease product when product not found', async () => {
    const id = new Types.ObjectId().toString();
    const response = await request(app).post(`/products/${id}/sell`).send({
      amount: 10
    });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(`Product ${id} not found`);
  });

  it('should fail to decrease product when insufficient stock amount', async () => {
    const response = await request(app)
      .post(`/products/${productId}/sell`)
      .send({
        amount: 11
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      `Insufficient stock in the warehouse for product ${productId}.`
    );
  });
});
