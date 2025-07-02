import { Hono } from 'hono';

import feedRouter from "./feednotifications";
import notificationRouter from "./notifications";
import webhookRouter from "./webhook";

const router = new Hono();

router.route("/feednotifications", feedRouter);
router.route("/notifications", notificationRouter);
router.route("/webhook", webhookRouter);

export default router;
