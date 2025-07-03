import baseRouter from "./routes/base-router";
import baseMiddleware from "./middlewares/base-middleware";
import db from "./database/index";
import models from "./database/models";
import "dotenv/config";
import apiKeyMiddleware from "./middlewares/verify-requests";
import { HttpErrorCode, HttpErrorMessage } from "./utils/httpjson";

import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import { cors } from 'hono/cors';

const app = new Hono()
export default app

// app.use(apiKeyMiddleware); 

app.use(
  cors({
    origin: process.env.FRONTEND_SITE || 'http://localhost:3000',
    credentials: true,
    exposeHeaders: ['Set-Cookie']
  })
);

app.route("/", baseMiddleware);
app.route("/", baseRouter);

app.all("/*", () => {
    return Response.json(
        {
            code: HttpErrorCode.NotFound,
            message: HttpErrorMessage.NotFound
        },
        {
            status: HttpErrorCode.NotFound
        }
    );
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

serve({
  fetch: app.fetch,
  port: PORT
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
