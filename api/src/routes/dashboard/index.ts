import express, { Router } from "express";
import dashboardRouter from "./@me";
import tpaRouter from "./tpa";
import leaderboardRouter from "./leaderboard";
import userrankconfigRouter from "./userrankconfig";
import webhookRouter from "./webhook";

const router: Router = express.Router();

router.use("/@me", dashboardRouter);
router.use("/thirdpartyannouncements", tpaRouter);
router.use("/leaderboard", leaderboardRouter);
router.use("/userrankconfig", userrankconfigRouter);
router.use("/webhook", webhookRouter);

export default router;
