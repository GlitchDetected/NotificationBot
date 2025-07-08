import type { User } from "../database/models/User";

declare module "hono" {
    interface ContextVariableMap {
        user: User;
        userId: id;
    }
}