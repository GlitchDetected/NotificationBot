import { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import User from "../database/models/User";
import jwt from "jsonwebtoken";
import { parse } from "cookie"

interface DecodedToken {
  id?: string;
}

export const setReqUser: MiddlewareHandler = async (c, next) => {
  try {
    const token = getCookie(c, 'sessiontoken');

    if (!token) return next();

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    if (decodedToken?.id) {
      const targetUser = await User.findOne({ where: { id: decodedToken.id } });

      if (targetUser) {
        c.set('user', targetUser)
      }
    }
  } catch (error) {
    console.error(error);
  }

  await next();
}
