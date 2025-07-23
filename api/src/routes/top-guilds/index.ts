import { Hono } from "hono";

const router = new Hono();

const DISCORD_ENDPOINT = process.env.DISCORD_ENDPOINT;
const BOT_TOKEN = process.env.DISCORD_TOKEN;

router.get("/", async (c) => {
    try {
        const res = await fetch(`${DISCORD_ENDPOINT}/users/@me/guilds`, {
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`
            }
        });

        if (!res.ok) {
            console.error("Failed to fetch bot guild list");
            return c.json({ error: "Failed to fetch guilds" }, 500);
        }

        const botGuilds = await res.json();

        const enriched = await Promise.all(
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

                    return {
                        id: full.id,
                        name: full.name,
                        icon: full.icon ?? null,
                        memberCount: full.approximate_member_count || 0,
                        verified: full.verified || false,
                        partnered: full.features?.includes("PARTNERED") || false
                    };
                } catch (err) {
                    console.error("Fetch error for guild", guild.id, err);
                    return null;
                }
            })
        );

        return c.json(enriched.filter(Boolean));
    } catch (err) {
        console.error("Unexpected error:", err);
        return c.json({ error: "Internal server error" }, 500);
    }
});

export default router;