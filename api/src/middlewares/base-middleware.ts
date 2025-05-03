import setReqUser from "./set-req-user";
import express, { Router } from "express";

const router: Router = express.Router();

router.use(setReqUser);
export default router;
