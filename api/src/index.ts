import express, { Application, Request, Response } from "express";
import baseRouter from "./routes/base-router";
import baseMiddleware from "./middlewares/base-middleware";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./database/index";
import models from "./database/models";
import "dotenv/config";
import apiKeyMiddleware from "./middlewares/verify-requests";

const app: Application = express();
app.use(express.json());

// app.use(apiKeyMiddleware); 

app.set("trust proxy", [
  "loopback", // Trust local (localhost, 127.0.0.1)
  "::1", // Trust local IPv6
  "198.41.128.0/17", // Cloudflare IPv4 range
  "199.27.128.0/21", // Cloudflare IPv4 range
  "103.21.244.0/22", // Cloudflare IPv4 range
  "103.22.200.0/22", // Cloudflare IPv4 range
  "103.31.4.0/22", // Cloudflare IPv4 range
  "141.101.64.0/18", // Cloudflare IPv4 range
  "108.162.192.0/18", // Cloudflare IPv4 range
  "190.93.240.0/20", // Cloudflare IPv4 range
  "188.114.96.0/22", // Cloudflare IPv4 range
  "197.234.240.0/22", // Cloudflare IPv4 range
  "198.41.192.0/22" // Cloudflare IPv4 range
]);

app.use(cors({ credentials: true, origin: process.env.FRONTEND_SITE, exposedHeaders: ["Set-Cookie"] }));
app.use(cookieParser());

app.use("/", baseMiddleware);
app.use("/", baseRouter);

app.get("/", async (req: Request, res: Response): Promise<any> => {
  return res.status(404).json({ message: "Resource not found" });
});

const PORT = Number(process.env.PORT) || 3001;

console.clear();

Object.keys(models).forEach((ele) => {
  const model = (models as any)[ele];
  if (model.associate) {
    model.associate(models);
  }
  console.log(`Passed through model: ${model.name}`);
});

db.sync({
  force: false
});
console.log(`Completed database connection`);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on port http://localhost:${PORT}/`);
});
