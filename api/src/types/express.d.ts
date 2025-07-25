// src/types/express.d.ts
import type { User } from "../database/models/User";

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}