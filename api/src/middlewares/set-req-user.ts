/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MiddlewareHandler } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import jwt from "jsonwebtoken";

import { HttpErrorMessage } from "@/src/constants/http-error";
import { httpError } from "@/src/utils/httperrorHandler";

import config from "../config";
import { getUser } from "../db/models/user";

interface DecodedToken {
    id?: string;
}

export const setReqUser: MiddlewareHandler = async (c, next) => {
    try {
        const token = getCookie(c, "sessiontoken");

        if (!token) return next();

        const decodedToken = jwt.verify(token, config.apiSecrets.jwtSecret!) as DecodedToken;

        if (decodedToken?.id) {
            const targetUser = await getUser(decodedToken.id!);

            if (targetUser) {
                c.set("user", targetUser);
            }

            if (!targetUser) {
                return httpError(HttpErrorMessage.Unauthorized);
            }
        }
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            setCookie(c, "sessiontoken", "", {
                path: "/",
                maxAge: 0,
                httpOnly: true,
                secure: true,
                sameSite: "Lax"
            });

            return httpError(HttpErrorMessage.InvalidSessionToken);
        }

        console.error("JWT verification error:", error);
        return httpError(HttpErrorMessage.InvalidSessionToken);
    }

    await next();
};