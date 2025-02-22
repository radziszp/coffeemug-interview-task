import mongoose from 'mongoose';
import { Config } from '../config';

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(Config.mongoUri);
  } catch (err) {
    console.error('Connection with mongoDB error', err);
    process.exit(1);
  }
}
