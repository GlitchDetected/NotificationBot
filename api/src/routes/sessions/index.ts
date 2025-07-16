import { Hono } from "hono";
import jwt from "jsonwebtoken";

import { HttpErrorMessage } from "../../constants/http-error";
import User from "../../database/models/User";
import { httpError } from "../../utils/httperrorHandler";

const router = new Hono();

const DISCORD_ENDPOINT = process.env.DISCORD_ENDPOINT;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;

router.post("/", async (c) => {
    try {
        const { code, redirectUri } = await c.req.json();

        const oauthRes = await fetch(`${DISCORD_ENDPOINT}/oauth2/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                client_id: CLIENT_ID || "",
                client_secret: CLIENT_SECRET || "",
                grant_type: "authorization_code",
                redirect_uri: redirectUri || "",
                code: typeof code === "string" ? code : ""
            }).toString()
        });

        if (!oauthRes.ok) {
            const oauthError = await oauthRes.text();
            console.error("OAuth Error:", oauthError);
            return c.json({ message: "OAuth error", error: oauthError }, 400);
        }

        const oauthResJson = await oauthRes.json();

        // https://discord.com/developers/docs/resources/user
        const userRes = await fetch(`${DISCORD_ENDPOINT}/users/@me`, {
            headers: {
                Authorization: `Bearer ${oauthResJson.access_token}`
            }
        });

        if (!userRes.ok) {
            const userError = await userRes.text();
            console.error("User Fetch Error:", userError);
            return c.json({ message: "User fetch error", error: userError }, 400);
        }

        const userResJson = await userRes.json();

        let user = await User.findOne({ where: { id: userResJson.id } });

        if (!user) {
            user = new User({
                id: userResJson.id,
                email: userResJson.email,
                username: userResJson.username,
                displayName: userResJson.global_name,
                avatarHash: userResJson.avatar,
                accessToken: oauthResJson.access_token,
                refreshToken: oauthResJson.refresh_token
            });
        } else {
            user.email = userResJson.email;
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

        return c.json({ sessiontoken: token });

    } catch (err) {
        console.error("Error processing sessions data:", err);
        return c.json({ error: "Internal server error" });
    }
});

router.get("/", (c) => {
    try {

        const user = c.get("user");

        if (!user?.accessToken) {
            return httpError(HttpErrorMessage.MissingAccess);
        }

        return c.json({
            id: user.id,
            email: user.email,
            username: user.username,
            displayName: user.displayName,
            avatarHash: user.avatarHash
        });
    } catch (err) {
        console.error("Error processing sessions data:", err);
        return c.json({ error: "Internal server error" });
    }
});

export default router;