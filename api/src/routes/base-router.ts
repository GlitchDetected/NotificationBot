import { Hono } from 'hono';

import dashboardRouter from "./dashboard";
import statusRouter from "./status";
import commandsRouter from "./commands";
import sessionsRouter from "./sessions";
import authRouter from "./auth";
import guildsRouter from "./guilds"

const router = new Hono();

router.route("/dashboard", dashboardRouter);
router.route("/status", statusRouter);
router.route("/commands", commandsRouter);
router.route("/sessions", sessionsRouter);
router.route("/auth", authRouter);
router.route("/guilds", guildsRouter);

export default router;
