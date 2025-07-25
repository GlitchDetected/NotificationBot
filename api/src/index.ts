import "@dotenvx/dotenvx/config";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { HttpErrorCode, HttpErrorMessage } from "./constants/http-error";
import db from "./database/index";
import models, { type ModelsMap } from "./database/models";
import baseMiddleware from "./middlewares/base-middleware";
import baseRouter from "./routes/base-router";

const app = new Hono();
export default app;
// app.use(apiKeyMiddleware);

app.use(
    cors({
        origin: process.env.FRONTEND_SITE || "http://localhost:3000",
        credentials: true,
        exposeHeaders: ["Set-Cookie"]
    })
);

app.route("/", baseMiddleware);
app.route("/", baseRouter);

app.all("/*", () => {
    return Response.json(
        {
            status: HttpErrorCode.NotFound,
            message: HttpErrorMessage.NotFound
        },
        {
            status: HttpErrorCode.NotFound
        }
    );
});

const PORT = Number(process.env.PORT) || 3001;

console.clear();

// register associations between sequelize models at runtime
Object.entries(models).forEach(([_, model]) => {
    if ("associate" in model && typeof model.associate === "function") {
        (model.associate as (models: ModelsMap) => void)(models);
    }

    console.log(`Registered: ${model.name}`);
});

db.sync({
    force: false
});

console.log("Connected to PG DB");

serve({
    fetch: app.fetch,
    port: PORT
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});