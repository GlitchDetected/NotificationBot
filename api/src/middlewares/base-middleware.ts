import { setReqUser } from "./set-req-user";
import { Hono } from "hono";

const router = new Hono();

router.use("*", setReqUser);
export default router;