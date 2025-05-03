import express, { Router } from "express";
import authRouter from "./auth";
import ticketsRouter from "./tickets";
import dashboardRouter from "./dashboard";
import uptimeRouter from "./uptime";
import commandsRouter from "./commands";

const router: Router = express.Router();

router.use("/auth", authRouter);
router.use("/tickets", ticketsRouter);
router.use("/dashboard", dashboardRouter);
router.use("/uptime", uptimeRouter);
router.use("/commands", commandsRouter);

export default router;
