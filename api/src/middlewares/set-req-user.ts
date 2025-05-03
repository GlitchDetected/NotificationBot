import { Request, Response, NextFunction } from "express";
import User from "../database/models/User";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id?: string;
}

export default async function setReqUser(req: Request, res: Response, next: NextFunction) {
  try {
    const cookies = req.cookies;
    const token = cookies?.token;

    if (!token) return next();

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    if (decodedToken?.id) {
      const targetUser = await User.findOne({ where: { id: decodedToken.id } });

      if (targetUser) req.user = targetUser;
    }
  } catch (error) {
    console.error(error);
  }

  next();
}
