import { Hono } from "hono";

import commandsRouter from "./commands";
import dashboardRouter from "./dashboard";
import guildsRouter from "./guilds";
import sessionsRouter from "./sessions";
import statusRouter from "./status";

const router = new Hono();

router.route("/dashboard", dashboardRouter);
router.route("/status", statusRouter);
router.route("/commands", commandsRouter);
router.route("/sessions", sessionsRouter);
router.route("/guilds", guildsRouter);

export default router;