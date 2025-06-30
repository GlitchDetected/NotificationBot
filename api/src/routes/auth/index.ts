import { Hono } from 'hono'
import {
  getCookie,
  getSignedCookie,
  setCookie,
  setSignedCookie,
  deleteCookie,
} from 'hono/cookie'
import User from "../../database/models/User";
import jwt from "jsonwebtoken";
import { httpError } from '../../utils/httperror';
import { HttpErrorMessage } from '../../utils/httpjson';

const router = new Hono();

// GET: api.notificationbot.xyz/auth/signin
// GET: api.notificationbot.xyz/auth/callback

const FRONTEND_SITE = process.env.FRONTEND_SITE || "http://localhost:3000";
const DASHBOARD_URL = `${FRONTEND_SITE}/profile`;

router.get("/signin", async (c) => {
  return c.redirect(`${process.env.OAUTH_URI}`);
});

router.get("/callback", async (c) => {
  const DISCORD_ENDPOINT = "https://discord.com/api/v10";
  const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
  const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;

  const code = c.req.query('code');

  if (!code) {
      return httpError(HttpErrorMessage.coderequired);
  }

  try {
    const oauthRes = await fetch(`${DISCORD_ENDPOINT}/oauth2/token`, {
      method: "POST",
      body: new URLSearchParams({
        client_id: CLIENT_ID || "",
        client_secret: CLIENT_SECRET || "",
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI || "",
        code: typeof code === "string" ? code : ""
      }).toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    if (!oauthRes.ok) {
      const oauthError = await oauthRes.text();
      console.error("OAuth Error:", oauthError);
      return c.text("OAuth error: " + oauthError);
    }

    const oauthResJson = await oauthRes.json();

    const userRes = await fetch(`${DISCORD_ENDPOINT}/users/@me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${oauthResJson.access_token}`
      }
    });

    if (!userRes.ok) {
      const userError = await userRes.text();
      console.error("User Fetch Error:", userError);
      return c.text("User fetch error: " + userError);
    }

    const userResJson = await userRes.json();

    let user = await User.findOne({ where: { id: userResJson.id } });

    if (!user) {
      user = new User({ // https://discord.com/developers/docs/resources/user
        email: userResJson.email,
        id: userResJson.id,
        username: userResJson.username,
        displayName: userResJson.global_name,
        avatarHash: userResJson.avatar,
        accessToken: oauthResJson.access_token,
        refreshToken: oauthResJson.refresh_token
      });
    } else {
      user.email = userResJson.email,
      user.username = userResJson.username;
      user.displayName = userResJson.global_name;
      user.avatarHash = userResJson.avatar;
      user.accessToken = oauthResJson.access_token;
      user.refreshToken = oauthResJson.refresh_token;
    }

    await user.save();

    const token = jwt.sign(
      {
        email: userResJson.email,
        id: userResJson.id,
        username: userResJson.username,
        displayName: userResJson.global_name,
        avatarHash: userResJson.avatar || null
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

      setCookie(c, 'sessiontoken', token, {
        domain: process.env.cookieDomain,
        httpOnly: true,
        secure: true,
        // secure: process.env.NODE_ENV === "production",
        maxAge: 604800,
        expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900)),
        sameSite: "none"
        // sameSite: ''
      })
      return c.redirect(DASHBOARD_URL);
  } catch (error) {
    console.error("Error during callback:", error);
    return c.text("Internal server error");
  }
});

router.get("/signout", async (c) => {
  deleteCookie(c, 'sessiontoken', {
      domain: process.env.cookieDomain,
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "none"
    })
    return c.json({ message: "Signed out successfully" }, 200);
});

export default router;