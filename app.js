import swaggerUi from "swagger-ui-express";
import express from "express";
import fs from "fs";
import path from "path";

const app = express();

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve("docs/swagger.json"), "utf8")
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
  console.log("Swagger docs available at http://localhost:3000/api-docs");
});