import express, { Router } from "express";
import dashboardRouter from "./dashboard";
import statusRouter from "./status";
import commandsRouter from "./commands";
import sessionsRouter from "./sessions";
import authRouter from "./auth";

const router: Router = express.Router();

router.use("/dashboard", dashboardRouter);
router.use("/status", statusRouter);
router.use("/commands", commandsRouter);
router.use("/sessions", sessionsRouter);
router.use("/auth", authRouter);

export default router;
