import { Hono } from "hono";

import config from "@/src/config";

const router = new Hono();

const DISCORD_ENDPOINT = config.discordEndpoint;
const BOT_TOKEN = config.client.token;

router.get("/", async (c) => {
    try {
        const res = await fetch(`${DISCORD_ENDPOINT}/users/@me/guilds`, {
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`
            }
        });

        if (!res.ok) {
            return c.json({ error: "Failed to fetch guilds" }, 500);
        }

        const botGuilds = await res.json();

        let totalUsers = 0;

        const allGuilds = await Promise.all(
            botGuilds.map(async (guild: { id: string; }) => {
                try {
                    const detailRes = await fetch(`${DISCORD_ENDPOINT}/guilds/${guild.id}?with_counts=true`, {
                        headers: {
                            Authorization: `Bot ${BOT_TOKEN}`
                        }
                    });

                    if (!detailRes.ok) {
                        console.error("Failed to fetch guild:", guild.id);
                        return null;
                    }

                    const full = await detailRes.json();

                    const memberCount = full.approximate_member_count || 0;
                    totalUsers += memberCount;

                    return {
                        id: full.id,
                        name: full.name,
                        icon: full.icon ?? null,
                        memberCount,
                        verified: full.verified || false,
                        partnered: full.features?.includes("PARTNERED") || false
                    };
                } catch (err) {
                    console.error("Fetch error for guild", guild.id, err);
                    return null;
                }
            })
        );

        const validGuilds = allGuilds.filter(Boolean);

        return c.json({
            guildCount: validGuilds.length,
            userCount: totalUsers,
            guilds: validGuilds
        });
    } catch {
        return c.json({ error: "Internal server error" }, 500);
    }
});

export default router;