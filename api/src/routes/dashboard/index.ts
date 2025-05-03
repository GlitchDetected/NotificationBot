import express, { Router } from "express";
import dashboardRouter from "./@me";
import rankconfigureRouter from "./rankconfig";
import leaderboardRouter from "./leaderboard";
import userrankconfigRouter from "./userrankconfig";
import afkRouter from "./afk";
import webhookRouter from "./webhook";

const router: Router = express.Router();

router.use("/@me", dashboardRouter);
router.use("/rankconfigure", rankconfigureRouter);
router.use("/leaderboard", leaderboardRouter);
router.use("/userrankconfig", userrankconfigRouter);
router.use("/afk", afkRouter);
router.use("/webhook", webhookRouter);

export default router;
