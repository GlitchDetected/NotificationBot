import { Hono } from 'hono';

import User from "../../database/models/User";
import jwt from "jsonwebtoken";

const router = new Hono();

// localhost:3001/sessions/
// api.notificationbot.xyz/sessions/

router.get("/", async (c) => {
    const DISCORD_ENDPOINT = "https://discord.com/api/v10";
  const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;

  try {
    return c.json("code");
    return c.json({ message: "sessions data updated"});
  } catch (err) {
    console.error("Error processing sessions data:", err);
    return c.json({ error: "Internal server error" });
  }
});

export default router;