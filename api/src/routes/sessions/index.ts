import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import User from "../../database/models/User";

import { httpError } from '../../utils/httperror';
import { HttpErrorMessage } from '../../utils/httpjson';

import jwt from "jsonwebtoken";

interface DecodedToken {
  id?: string;
}

const router = new Hono();

// localhost:3001/sessions/
// api.notificationbot.xyz/sessions/

router.get("/", async (c) => {
  const token = getCookie(c, 'sessiontoken')

    if (!token) {
    return httpError(HttpErrorMessage.InvalidSessionToken)
  }

  try {

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    const targetUser = await User.findOne({ where: { id: decodedToken.id } });

        if (!targetUser) {
    return httpError(HttpErrorMessage.InvalidSessionToken)
  }

  return c.json({
      id: targetUser.id,
      email: targetUser.email,
      username: targetUser.username,
      displayName: targetUser.displayName,
      avatarHash: targetUser.avatarHash
  })
  } catch (err) {
    console.error("Error processing sessions data:", err);
    return c.json({ error: "Internal server error" });
  }
});

export default router;