/* eslint-disable @typescript-eslint/no-explicit-any */
import { Hono } from "hono";

import FollowUpdates from "@/database/models/followupdates";
import { httpError } from "@/utils/httperror";
import { HttpErrorMessage } from "@/utils/httpjson";
import type { ApiV1GuildsGetResponse } from "~/typings";

const router = new Hono();

const DISCORD_ENDPOINT = process.env.DISCORD_ENDPOINT;

import modulesRouter from "./modules";
router.route("/modules", modulesRouter);

router.get("/", async (c) => {
    const guildId = c.req.param("guildId");

    const user = c.get("user");

    if (!user?.accessToken) {
        return httpError(HttpErrorMessage.MissingAccess);
    }

    const guildRes = await fetch(`${DISCORD_ENDPOINT}/guilds/${guildId}`, {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`
        }
    });

    if (!guildRes.ok) {
        return httpError(HttpErrorMessage.guildFetchError);
    }

    const guild = await guildRes.json();

    const followUpdates = await FollowUpdates.findOne({ where: { guildId: guildId } });

    return c.json({
        id: guild.id,
        name: guild.name ?? null,
        icon: guild.icon ?? null,
        banner: guild.banner ?? null,
        memberCount: guild.approximate_member_count || 0,
        inviteUrl: `https://discord.com/channels/${guild.id}`,
        description: guild.description ?? null,
        follownewsChannel: {
            id: followUpdates?.id ?? null,
            name: followUpdates?.name ?? null
        }
    });
});

router.get("/channels", async (c) => {
    const guildId = c.req.param("guildId");

    const user = c.get("user");

    if (!user?.accessToken) {
        return httpError(HttpErrorMessage.MissingAccess);
    }

    const channelsRes = await fetch(`${DISCORD_ENDPOINT}/guilds/${guildId}/channels`, {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`
        }
    });

    if (!channelsRes.ok) {
        return httpError(HttpErrorMessage.guildFetchError);
    }

    const channels = await channelsRes.json();

    return c.json(channels);
});

router.get("/roles", async (c) => {
    const guildId = c.req.param("guildId");

    const user = c.get("user");

    if (!user?.accessToken) {
        return httpError(HttpErrorMessage.MissingAccess);
    }

    const rolesRes = await fetch(`${DISCORD_ENDPOINT}/guilds/${guildId}/roles`, {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`
        }
    });

    if (!rolesRes.ok) {
        return httpError(HttpErrorMessage.guildFetchError);
    }

    const roles = await rolesRes.json();

    return c.json(roles);
});

router.get("/emojis", async (c) => {
    const guildId = c.req.param("guildId");

    const user = c.get("user");

    if (!user?.accessToken) {
        return httpError(HttpErrorMessage.MissingAccess);
    }

    const emojisRes = await fetch(`${DISCORD_ENDPOINT}/guilds/${guildId}/emojis`, {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`
        }
    });

    if (!emojisRes.ok) {
        return httpError(HttpErrorMessage.guildFetchError);
    }

    const emojis = await emojisRes.json();

    return c.json(emojis);
});

router.patch("/follow-updates", async (c) => {
    const guildId = c.req.param("guildId");
    const user = c.get("user");
    if (!user?.accessToken) {
        return httpError(HttpErrorMessage.MissingAccess);
    }
    const body = await c.req.json() as ApiV1GuildsGetResponse["follownewsChannel"];
    console.log(body);

    try {
        let config = await FollowUpdates.findOne({ where: { guildId: guildId } });

        let channelName: string | null = null;
        if (body?.channelId) {
            const res = await fetch(`https://discord.com/api/v10/channels/${body.channelId}`, {
                headers: {
                    Authorization: `Bot ${process.env.DISCORD_TOKEN}`
                }
            });

            const channelData = await res.json();
            channelName = channelData.name;
        }

        if (config) {
            const keys: "channelId"[] = ["channelId"];

            if (!body) {
                return httpError(HttpErrorMessage.BadRequest);
            }

            for (const key of keys) {
                if (key in body) {
                    (config as any)[key] = body[key];
                }
            }
            await config.save();
        } else {
            config = await FollowUpdates.create({
                guildId: guildId,
                channelId: body?.channelId,
                name: channelName
            });
        }

        return c.json({
            channelId: config.id,
            name: config.name ?? null
        });
    } catch (error) {
        console.error("Error updating follow-updates:", error);
    }
});

export default router;