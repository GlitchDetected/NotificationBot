import { Hono } from "hono";

import { HttpErrorMessage } from "@/constants/http-error";
import Welcome from "@/db/models/welcome";
import { httpError } from "@/utils/httperrorHandler";
import type { ApiV1GuildsModulesWelcomeGetResponse, GuildEmbed } from "~/typings";

interface TestPayload {
    content?: string;
    embeds?: GuildEmbed[];
}

const router = new Hono();

type UpdatableFields = "enabled" | "channelId" | "roleIds" | "pingIds" | "deleteAfter" | "deleteAfterLeave" | "restore";

router.get("/", async (c) => {
    const guildId = c.req.param("guildId");

    try {
        const config = await Welcome.findOne({ where: { guildId } });

        return c.json({
            enabled: config?.enabled ?? false,
            channelId: config?.channelId ?? null,

            message: {
                content: config?.message?.content ?? null,
                embed: config?.message?.embed ?? null
            },

            roleIds: config?.roleIds ?? [],
            pingIds: config?.pingIds ?? [],
            deleteAfter: config?.deleteAfter ?? 0,
            deleteAfterLeave: config?.deleteAfterLeave ?? false,
            restore: config?.isRestorable ?? false,

            dm: {
                enabled: config?.dm?.enabled ?? false,
                message: {
                    content: config?.dm?.message?.content ?? null,
                    embed: config?.dm?.message?.embed ?? null
                }
            },

            reactions: {
                welcomeMessageEmojis: config?.reactions?.welcomeMessageEmojis ?? [],
                firstMessageEmojis: config?.reactions?.firstMessageEmojis ?? []
            },

            card: {
                enabled: config?.card?.enabled ?? false,
                inEmbed: config?.card?.inEmbed ?? false,
                background: config?.card?.background ?? null,
                textColor: config?.card?.textColor ?? null
            },

            button: {
                enabled: config?.button?.enabled ?? false,
                style: config?.button?.style ?? 1,
                type: config?.button?.type ?? 0,
                emoji: config?.button?.emoji ?? null,
                label: config?.button?.label ?? null,
                ping: config?.button?.ping ?? false
            }
        });
    } catch (error) {
        console.error("Error fetching welcome configuration:", error);
    }
});

router.patch("/", async (c) => {
    const guildId = c.req.param("guildId");
    const body = await c.req.json() as ApiV1GuildsModulesWelcomeGetResponse;

    try {
        let config = await Welcome.findOne({ where: { guildId: guildId } });
        if (config) {
            const keys: ("enabled" | "channelId" | "roleIds" | "pingIds" | "deleteAfter" | "deleteAfterLeave" | "restore")[] =
      ["enabled", "channelId", "roleIds", "pingIds", "deleteAfter", "deleteAfterLeave", "restore"];

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

            if (typeof body.dm === "object" && body.dm !== null) {
                config.dm = {
                    enabled: typeof body.dm.enabled === "boolean"
                        ? body.dm.enabled
                        : config.dm?.enabled ?? false,
                    message: {
                        content: "content" in (body.dm.message || {})
                            ? body.dm.message?.content
                            : config.dm?.message?.content ?? undefined,
                        embed: "embed" in (body.dm.message || {})
                            ? body.dm.message?.embed
                            : config.dm?.message?.embed ?? undefined
                    }
                };
            }

            if (typeof body.reactions === "object" && body.reactions !== null) {
                config.reactions = {
                    welcomeMessageEmojis: Array.isArray(body.reactions.welcomeMessageEmojis)
                        ? body.reactions.welcomeMessageEmojis
                        : config.reactions?.welcomeMessageEmojis ?? [],
                    firstMessageEmojis: Array.isArray(body.reactions.firstMessageEmojis)
                        ? body.reactions.firstMessageEmojis
                        : config.reactions?.firstMessageEmojis ?? []
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

            if (typeof body.button === "object" && body.button !== null) {
                config.button = {
                    enabled: typeof body.button.enabled === "boolean"
                        ? body.button.enabled
                        : config.button?.enabled ?? false,
                    style: [1, 2, 3, 4].includes(body.button.style)
                        ? body.button.style
                        : config.button?.style ?? 1,
                    type: 0,
                    emoji: "emoji" in body.button
                        ? body.button.emoji
                        : config.button?.emoji ?? null,
                    label: "label" in body.button
                        ? body.button.label
                        : config.button?.label ?? null,
                    ping: typeof body.button.ping === "boolean"
                        ? body.button.ping
                        : config.button?.ping ?? false
                };
            }

            await config.save();
        } else {
        // create if the guild does not have a configuration
            config = await Welcome.create({
                guildId: guildId,
                enabled: body.enabled,
                channelId: body.channelId,

                message: {
                    content: body.dm?.message?.content ?? "Welcome to {guild.name} {user.name}, we are currently at {guild.memberCount} members!",
                    embed: body.dm?.message?.embed ?? null
                },


                roleIds: Array.isArray(body.roleIds) ? body.roleIds : [],
                pingIds: Array.isArray(body.pingIds) ? body.pingIds : [],
                deleteAfter: body.deleteAfter,
                deleteAfterLeave: body.deleteAfterLeave,
                isRestorable: body.restore,

                dm: {
                    enabled: body.dm?.enabled ?? false,
                    message: {
                        content: body.dm?.message?.content ?? "Welcome to {guild.name} {user.name}, we are currently at {guild.memberCount} members!",
                        embed: body.dm?.message?.embed ?? null
                    }
                },

                reactions: {
                    welcomeMessageEmojis: Array.isArray(body.reactions?.welcomeMessageEmojis) ? body.reactions.welcomeMessageEmojis : [],
                    firstMessageEmojis: Array.isArray(body.reactions?.firstMessageEmojis) ? body.reactions.firstMessageEmojis : []
                },

                card: {
                    enabled: body.card?.enabled ?? false,
                    inEmbed: body.card?.inEmbed ?? false,
                    background: body.card?.background ?? null,
                    textColor: typeof body.card?.textColor === "number" ? body.card.textColor : null
                },

                button: {
                    enabled: body.button?.enabled ?? false,
                    style: [1, 2, 3, 4].includes(body.button?.style) ? body.button.style : 1,
                    type: 0,
                    emoji: body.button?.emoji ?? null,
                    label: body.button?.label ?? null,
                    ping: body.button?.ping ?? false
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
        const config = await Welcome.findOne({ where: { guildId } });

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
            console.error("Discord API Error:", error);
        }
        return c.json({ success: true });
    } catch (error) {
        console.error("Error sending test welcome message:", error);
    }
});

export default router;