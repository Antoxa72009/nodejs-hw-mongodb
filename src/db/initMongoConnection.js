import mongoose from 'mongoose';

export const initMongoConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: process.env.MONGODB_DB,
      user: process.env.MONGODB_USER,
      pass: process.env.MONGODB_PASSWORD,
    });
    console.log('Mongo connection successfully established!');
  } catch (err) {
    console.error('Mongo connection error:', err);
    process.exit(1);
  }
};