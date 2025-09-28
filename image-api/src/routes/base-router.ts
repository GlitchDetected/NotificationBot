import { Hono } from "hono";

import imagesRouter from "./images";

const router = new Hono();

router.route("/images", imagesRouter);

export default router;