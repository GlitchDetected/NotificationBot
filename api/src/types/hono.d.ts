import type { User } from "../database/models/User";
import type { Context } from "hono";

declare module "hono" {
  interface ContextVariableMap {
    user: User;
  }
}
