import type { APIGuild, PermissionResolvable } from "discord.js";
import { Hono } from "hono";

import { hasPermissions } from "@/lib/checkPerms";
import redis from "@/lib/redis";
import { httpError } from "@/utils/httperror";
import { HttpErrorMessage } from "@/utils/httpjson";
const router = new Hono();
const DISCORD_ENDPOINT = process.env.DISCORD_ENDPOINT;

import dmnRouter from "./dmnotifications";
router.route("/dmnotifications", dmnRouter);

router.get("/", (c) => {
    const user = c.get("user");

    if (user) {
        const { ...userWithoutTokens } = user;
        return c.json(userWithoutTokens);
    } else {
        return httpError(HttpErrorMessage.MissingAccess);
    }
});

router.get("/guilds", async (c) => {
    const user = c.get("user");
    if (!user?.accessToken) {
        return httpError(HttpErrorMessage.MissingAccess);
    }

    const url = new URL(c.req.url, "http://localhost");
    const skipCache = url.searchParams.get("skipcache");

    if (!skipCache) {
        const redisCacheRes = await redis.get(`user-guilds:${user.id}`);

        if (redisCacheRes) {
            return c.json(JSON.parse(redisCacheRes));
        }
    }

    const guildsRes = await fetch(`${DISCORD_ENDPOINT}/users/@me/guilds`, {
        headers: {
            Authorization: `Bearer ${user.accessToken}`
        }
    });

    if (!guildsRes.ok) {
        return c.json({ message: "Failed to fetch guilds" });
    }

    const guilds = await guildsRes.json();

    // Filter user's guilds where they have the "ManageGuild" permission
    const filteredGuilds = guilds.filter((guild: { permissions: PermissionResolvable; }) =>
        hasPermissions(guild.permissions, "ManageGuild")
    );

    // Fetch the bot's guilds
    const botGuildsRes = await fetch(`${DISCORD_ENDPOINT}/users/@me/guilds`, {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`
        }
    });

    if (!botGuildsRes.ok) {
        return c.json({ message: "Failed to fetch bot's guilds" });
    }

    const botGuilds = await botGuildsRes.json();

    const guildsWithBot = await Promise.all(
        filteredGuilds.map((guild: APIGuild) => {
            const botInGuild = botGuilds.some((botGuild: APIGuild) => botGuild.id === guild.id);

            return {
                id: guild.id,
                name: guild.name,
                icon: guild.icon,
                botInGuild
            };
        })
    );

    await redis.set(`user-guilds:${user.id}`, JSON.stringify(guildsWithBot), "EX", 600);
    return c.json(guildsWithBot);
});

export default router;