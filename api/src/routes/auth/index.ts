import express, { Request, Response, Router } from "express";
import User from "../../database/models/User";
import jwt from "jsonwebtoken";

const router: Router = express.Router();

// GET: api.notification.bot/auth/signin
// GET: api.notification.bot/auth/callback

const FRONTEND_SITE = process.env.FRONTEND_SITE || "http://localhost:3000";
const DASHBOARD_URL = `${FRONTEND_SITE}/profile`;

router.get("/signin", (req: Request, res: Response) => {
  res.redirect(`${process.env.OAUTH_URI}`);
});

router.get("/callback", async (req: Request, res: Response): Promise<any> => {
  const DISCORD_ENDPOINT = "https://discord.com/api/v10";
  const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
  const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;

  const { code } = req.query;

  if (!code) {
    return res.status(400).json({
      error: 'A "code" query parameter must be present in the URL.'
    });
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
      return res.status(400).send("OAuth error: " + oauthError);
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
      return res.status(400).send("User fetch error: " + userError);
    }

    const userResJson = await userRes.json();

    let user = await User.findOne({ where: { id: userResJson.id } });

    if (!user) {
      user = new User({
        id: userResJson.id,
        username: userResJson.username,
        avatarHash: userResJson.avatar,
        accessToken: oauthResJson.access_token,
        refreshToken: oauthResJson.refresh_token
      });
    } else {
      user.username = userResJson.username;
      user.avatarHash = userResJson.avatar;
      user.accessToken = oauthResJson.access_token;
      user.refreshToken = oauthResJson.refresh_token;
    }

    await user.save();

    const avatarUrl = userResJson.avatar
      ? `https://cdn.discordapp.com/avatars/${userResJson.id}/${userResJson.avatar}.png`
      : `https://cdn.discordapp.com/embed/avatars/0.png`;

    const token = jwt.sign(
      {
        id: userResJson.id,
        username: userResJson.username,
        avatarUrl: avatarUrl,
        avatarHash: userResJson.avatar || null
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res
      .status(200)
      .cookie("token", token, {
        domain: process.env.cookieDomain,
        httpOnly: true,
        secure: true,
        // secure: process.env.NODE_ENV === "production",
        maxAge: 6.048e8,
        sameSite: "none"
        // expires: new Date(Date.now() + 6.048e8),
        // sameSite: ''
      })
      .redirect(DASHBOARD_URL);
  } catch (error) {
    console.error("Error during callback:", error);
    return res.status(500).send("Internal server error");
  }
});

router.get("/signout", (req: Request, res: Response) => {
  res
    // forcefully fuck up the cookie
    .clearCookie("token", {
      domain: process.env.cookieDomain,
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "none"
    })
    .sendStatus(200);
});

export default router;
