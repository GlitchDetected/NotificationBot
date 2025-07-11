import { Hono } from "hono";

import { HttpErrorMessage } from "@/constants/http-error";
import Bye from "@/database/models/bye";
import { httpError } from "@/utils/httperrorHandler";
import type { ApiV1GuildsModulesByeGetResponse, GuildEmbed } from "~/typings";

const router = new Hono();

type UpdatableFields = "enabled" | "channelId" | "webhookURL" | "deleteAfter";

interface TestPayload {
    content?: string;
    embeds?: GuildEmbed[];
}

router.get("/", async (c) => {
    const guildId = c.req.param("guildId");

    try {
        const config = await Bye.findOne({ where: { guildId } });

        return c.json({
            enabled: config?.enabled ?? false,
            channelId: config?.channelId ?? null,
            webhookURL: config?.webhookURL ?? null,

            message: {
                content: config?.message?.content ?? null,
                embed: config?.message?.embed ?? null
            },

            deleteAfter: config?.deleteAfter ?? 0,

            card: {
                enabled: config?.card?.enabled ?? false,
                inEmbed: config?.card?.inEmbed ?? false,
                background: config?.card?.background ?? null,
                textColor: config?.card?.textColor ?? null
            }
        });
    } catch (error) {
        console.error("Error fetching welcome configuration:", error);
    }
});

router.patch("/", async (c) => {
    const guildId = c.req.param("guildId");
    const body = await c.req.json() as ApiV1GuildsModulesByeGetResponse;
    console.log(body);

    try {
    // overwrite values if they are explicitly provided. Otherwise, preserve the existing ones.
        let config = await Bye.findOne({ where: { guildId: guildId } });
        if (config) {
            const keys: ("enabled" | "channelId" | "webhookURL" | "deleteAfter")[] =
      ["enabled", "channelId", "webhookURL", "deleteAfter"];
            for (const key of keys) {
                if (key in body) {
                    (config as Record<UpdatableFields, unknown>)[key] = body[key];
                }
            }

            if (typeof body.message === "object" && body.message !== null) {
                config.message = {
                    content:
      typeof body.message.content === "string"
          ? body.message.content
          : config.message?.content ?? null,
                    embed:
      typeof body.message.embed === "object" && body.message.embed !== null
          ? body.message.embed
          : config.message?.embed ?? undefined
                };
            }

            if (typeof body.card === "object" && body.card !== null) {
                config.card = {
                    enabled: typeof body.card.enabled === "boolean"
                        ? body.card.enabled
                        : config.card?.enabled ?? false,
                    inEmbed: typeof body.card.inEmbed === "boolean"
                        ? body.card.inEmbed
                        : config.card?.inEmbed ?? false,
                    background: "background" in body.card
                        ? body.card.background
                        : config.card?.background ?? undefined,
                    textColor: typeof body.card.textColor === "number"
                        ? body.card.textColor
                        : config.card?.textColor ?? undefined
                };
            }
            await config.save();
        } else {
        // create if the guild does not have a configuration
            config = await Bye.create({
                guildId: guildId,

                enabled: body.enabled,
                channelId: body.channelId,
                webhookURL: body.webhookURL,

                message: {
                    content: body.message?.content ?? "😔 It is sad to see you leave {guild.name}, {user.name}. Come back anytime!",
                    embed: body.message?.embed ?? null
                },

                deleteAfter: body.deleteAfter,

                card: {
                    enabled: body.card?.enabled ?? false,
                    inEmbed: body.card?.inEmbed ?? false,
                    background: body.card?.background ?? null,
                    textColor: typeof body.card?.textColor === "number" ? body.card.textColor : null
                }
            });
        }

        return c.json({ config: config });
    } catch (error) {
        console.error("Error creating/updating welcome configuration:", error);
    }
});

router.post("/test", async (c) => {
    const guildId = c.req.param("guildId");
    const user = c.get("user");

    try {
        const config = await Bye.findOne({ where: { guildId } });

        if (!config || !config.channelId) {
            return httpError(HttpErrorMessage.ChannelNotFound);
        }

        const content = config.message?.content?.trim() || `Hello @${user?.username}`;
        const embed = config.message?.embed ?? null;

        const payload: TestPayload = {};
        if (content) payload.content = content;
        if (embed) payload.embeds = [embed];

        const res = await fetch(`https://discord.com/api/v10/channels/${config.channelId}/messages`, {
            method: "POST",
            headers: {
                Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const error = await res.text();
            console.error(error);
        }
        return c.json({ success: true });
    } catch (error) {
        console.error("Error sending test welcome message:", error);
    }
});

export default router;