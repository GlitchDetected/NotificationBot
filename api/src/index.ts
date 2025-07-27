import "@dotenvx/dotenvx/config";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import config from "./config";
import { HttpErrorCode, HttpErrorMessage } from "./constants/http-error";
import baseMiddleware from "./middlewares/base-middleware";
import baseRouter from "./routes/base-router";

const app = new Hono();
export default app;

app.use(
    cors({
        origin: config.dashboard,
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

const PORT = config.api.apiPort;

serve({
    fetch: app.fetch,
    port: PORT
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});