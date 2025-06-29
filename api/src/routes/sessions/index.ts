import express, { Router, Request, Response } from "express";
import User from "../../database/models/User";
import jwt from "jsonwebtoken";

const router: Router = express.Router();

router.use(express.json());

// localhost:3001/sessions/
// api.notificationbot.xyz/sessions/

router.post("/", async (req: Request, res: Response): Promise<any> => {
    const DISCORD_ENDPOINT = "https://discord.com/api/v10";
  const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;

  try {
    const { code, redirecturi } = req.body;
    const data = req.body;
    console.log("Received POST /sessions:", data);

      if (!code || !redirecturi) {
    return res.status(400).json({
      error: 'A "code" query parameter must be present in the URL.'
    });
  }

    // store sessiontoken in cookies
        const oauthRes = await fetch(`${DISCORD_ENDPOINT}/oauth2/token`, {
      method: "POST",
      body: new URLSearchParams({
        client_id: CLIENT_ID || "",
        client_secret: CLIENT_SECRET || "",
        grant_type: code,
        redirect_uri: redirecturi || "",
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

    res
      .status(200)
      .cookie("sessiontoken", token, {
        domain: process.env.cookieDomain,
        httpOnly: true,
        secure: true,
        // secure: process.env.NODE_ENV === "production",
        maxAge: 6.048e8,
        sameSite: "none"
        // expires: new Date(Date.now() + 6.048e8),
        // sameSite: ''
      })
      .redirect(redirecturi);
    res.status(200).json({ message: "sessions data updated"});
  } catch (err) {
    console.error("Error processing sessions data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;