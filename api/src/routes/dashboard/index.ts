import { Hono } from 'hono';

import dashboardRouter from "./@me";
import tpaRouter from "./tpa";
import dmnotificationsRouter from "./dmnotifications";
import webhookRouter from "./webhook";
import feednotificationRouter from "./feednotifications";

const router = new Hono();

router.route("/@me", dashboardRouter);
router.route("/thirdpartyannouncements", tpaRouter);
router.route("/dmnotifications", dmnotificationsRouter);
router.route("/webhook", webhookRouter);
router.route("/feednotifications", feednotificationRouter);

export default router;
