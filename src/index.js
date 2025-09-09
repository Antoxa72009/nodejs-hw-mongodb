import dotenv from "dotenv";
dotenv.config();

import { initMongoConnection } from "./db/initMongoConnection.js";
import express from "express";
import cors from "cors";
import { contactsRouter } from "./routes/contacts.js";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler.js";

const bootstrap = async () => {
  await initMongoConnection();

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/contacts", contactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};

bootstrap();