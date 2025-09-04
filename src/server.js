import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import mongoose from 'mongoose';
import { getContactsController, getContactByIdController } from './controllers/contacts.js';

export const setupServer = async () => {
  const app = express();

  app.use(cors());
  app.use(pino());

  // --- Routes ---
  app.get('/contacts', getContactsController);
  app.get('/contacts/:contactId', getContactByIdController);

  // --- 404 handler ---
  app.use('*', (req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;

  try {
    // підключення до MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Mongo connection successfully established!');

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }

  return app;
};