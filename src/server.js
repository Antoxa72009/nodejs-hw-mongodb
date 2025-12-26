import express from "express";
import cors from "cors";
import pino from "pino-http";

import contactsRouter from "./routers/contacts.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { swaggerDocs } from "./middlewares/swaggerDocs.js";

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use("/contacts", contactsRouter);

  app.use("/api-docs", swaggerDocs());

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📄 Swagger docs: http://localhost:${PORT}/api-docs`);
  });

  return app;
};