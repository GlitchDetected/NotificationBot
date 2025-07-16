import type { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import jwt from "jsonwebtoken";

import { HttpErrorMessage } from "@/constants/http-error";
import { httpError } from "@/utils/httperrorHandler";

import User from "../database/models/User";

interface DecodedToken {
    id?: string;
}

export const setReqUser: MiddlewareHandler = async (c, next) => {
    try {
        const token = getCookie(c, "sessiontoken");

        if (!token) return next();

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

        if (decodedToken?.id) {
            const targetUser = await User.findOne({ where: { id: decodedToken.id } });

            if (targetUser) {
                c.set("user", targetUser);
            }

            if (!targetUser) {
                return httpError(HttpErrorMessage.InvalidAuthorization);
            }
        }
    } catch (error) {
        console.error(error);
    }

    await next();
};