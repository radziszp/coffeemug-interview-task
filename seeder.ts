import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product, Category } from './src/models/productModel';

dotenv.config({ path: '.env.seeder' });
const { Config } = await import('./src/config.js');

const products = [
  {
    name: 'Laptop',
    description: 'Gaming lap',
    price: 499999,
    stock: 10,
    category: Category.ELECTRONICS
  },
  {
    name: 'Samsung',
    description: 'Phone',
    price: 29990,
    stock: 15,
    category: Category.ELECTRONICS
  },
  {
    name: 'Keyboard',
    description: 'Gaming',
    price: 49999,
    stock: 30,
    category: Category.ELECTRONICS
  },
  {
    name: 'Chair',
    description: 'comfy',
    price: 19999,
    stock: 20,
    category: Category.HOME
  },
  {
    name: 'Sofa',
    description: 'comfy',
    price: 29999,
    stock: 20,
    category: Category.HOME
  },
  {
    name: 'Ball',
    description: 'round',
    price: 99,
    stock: 20,
    category: Category.SPORTS
  }
];

const seedDB = async () => {
  try {
    console.log('starting seed');
    await mongoose.connect(Config.mongoUri);
    console.log('connected to db');
    await Product.deleteMany();
    console.log('old products deleted');
    await Product.insertMany(products);
    console.log('new products inserted');
    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding products error:', error);
    mongoose.connection.close();
  }
};

seedDB();
