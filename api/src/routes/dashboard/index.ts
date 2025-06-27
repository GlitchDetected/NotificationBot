import express, { Router } from "express";
import dashboardRouter from "./@me";
import tpaRouter from "./tpa";
import dmnotificationsRouter from "./dmnotifications";
import webhookRouter from "./webhook";
import feednotificationRouter from "./feednotifications";

const router: Router = express.Router();

router.use("/@me", dashboardRouter);
router.use("/thirdpartyannouncements", tpaRouter);
router.use("/dmnotifications", dmnotificationsRouter);
router.use("/webhook", webhookRouter);
router.use("/feednotifications", feednotificationRouter);

export default router;
