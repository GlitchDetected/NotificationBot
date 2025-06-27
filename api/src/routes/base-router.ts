import express, { Router } from "express";
import authRouter from "./auth";
import dashboardRouter from "./dashboard";
import statusRouter from "./status";
import commandsRouter from "./commands";

const router: Router = express.Router();

router.use("/auth", authRouter);
router.use("/dashboard", dashboardRouter);
router.use("/status", statusRouter);
router.use("/commands", commandsRouter);

export default router;
