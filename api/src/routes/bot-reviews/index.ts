import { Hono } from "hono";

import Reviews from "@/db/models/reviews";

const router = new Hono();

const DISCORD_ENDPOINT = process.env.DISCORD_ENDPOINT;

router.get("/", async (c) => {
    const reviews = await Reviews.findAll();

    const enrichedReviews = await Promise.all(
        reviews.map(async (review) => {
            try {
                const guildRes = await fetch(
                    `${DISCORD_ENDPOINT}/guilds/${review.guildId}?with_counts=true`,
                    {
                        headers: {
                            Authorization: `Bot ${process.env.DISCORD_TOKEN}`
                        }
                    }
                );

                if (!guildRes.ok) {
                    console.error("Failed to fetch guild:", review.guildId);
                    return null;
                }

                const guild = await guildRes.json();

                return {
                    id: guild.id,
                    name: guild.name ?? null,
                    icon: guild.icon ?? null,
                    banner: guild.banner ?? null,
                    memberCount: guild.approximate_member_count || 0,
                    review: review.review
                };
            } catch (err) {
                console.error("Fetch error for guild", review.guildId, err);
                return null;
            }
        })
    );

    return c.json(enrichedReviews.filter(Boolean));
});


export default router;