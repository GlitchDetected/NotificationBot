import { Hono } from "hono";

import appConfig from "@/src/config";
import { now } from "@/src/constants/global";
import { HttpErrorMessage } from "@/src/constants/http-error";
import { getWelcome, upsertWelcome } from "@/src/db/models/welcome";
import { httpError } from "@/src/utils/httperrorHandler";
import type { ApiV1GuildsModulesWelcomeGetResponse, GuildEmbed } from "@/typings";

interface TestPayload {
    content?: string;
    embeds?: GuildEmbed[];
}

const router = new Hono();

type UpdatableFields =
    | "enabled"
    | "channelId"
    | "roleIds"
    | "pingIds"
    | "delete_after"
    | "delete_after_leave"
    | "restore";

const keyMap: Record<UpdatableFields, string> = {
    enabled: "enabled",
    channelId: "channel_id",
    roleIds: "role_ids",
    pingIds: "ping_ids",
    delete_after: "delete_after",
    delete_after_leave: "delete_after_leave",
    restore: "is_restorable"
};

router.get("/", async (c) => {
    const guildId = c.req.param("guildId");

    try {
        const config = await getWelcome(guildId!);

        return c.json({
            enabled: config?.enabled ?? false,
            channelId: config?.channel_id ?? null,

            message: {
                content: config?.message?.content ?? null,
                embed: config?.message?.embed ?? null
            },

            roleIds: Array.isArray(config?.role_ids) ? config.role_ids : [],
            pingIds: Array.isArray(config?.ping_ids) ? config.ping_ids : [],

            delete_after: config?.delete_after ?? 0,
            delete_after_leave: config?.delete_after_leave ?? false,
            restore: config?.is_restorable ?? false,

            dm: {
                enabled: config?.dm?.enabled ?? false,
                message: {
                    content: config?.dm?.message?.content ?? null,
                    embed: config?.dm?.message?.embed ?? null
                }
            },

            reactions: {
                welcomeMessageEmojis: config?.reactions?.welcome_message_emojis ?? [],
                firstMessageEmojis: config?.reactions?.first_message_emojis ?? []
            },

            card: {
                enabled: config?.card?.enabled ?? false,
                inEmbed: config?.card?.in_embed ?? false,
                background: config?.card?.background ?? null,
                textColor: config?.card?.text_color ?? null
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
    } catch {
        return c.json({ error: "Internal server error" }, 500);
    }
});

router.patch("/", async (c) => {
    const guildId = c.req.param("guildId");
    const body = await c.req.json() as ApiV1GuildsModulesWelcomeGetResponse;
    console.log(body);

    if (!guildId) {
        return c.json({ error: "Missing guildId parameter" }, 400);
    }

    try {
        const config = await getWelcome(guildId!);
        // CREATE new configuration
        if (!config) {
            const newConfig = await upsertWelcome({
                guild_id: guildId,
                enabled: body.enabled,
                channel_id: body.channelId,
                message: {
                    content: body.dm?.message?.content ??
            "Welcome to {guild.name} {user.name}, we are currently at {guild.memberCount} members!",
                    embed: body.dm?.message?.embed ?? undefined
                },
                role_ids: body.roleIds ?? [],
                ping_ids: body.pingIds ?? [],
                delete_after: body.delete_after,
                delete_after_leave: body.delete_after_leave,
                is_restorable: body.restore,
                dm: {
                    enabled: body.dm?.enabled ?? false,
                    message: {
                        content: body.dm?.message?.content ??
                "Welcome to {guild.name} {user.name}, we are currently at {guild.memberCount} members!",
                        embed: body.dm?.message?.embed ?? undefined
                    }
                },
                reactions: {
                    welcome_message_emojis: Array.isArray(body.reactions?.welcomeMessageEmojis)
                        ? body.reactions.welcomeMessageEmojis : [],
                    first_message_emojis: Array.isArray(body.reactions?.firstMessageEmojis)
                        ? body.reactions.firstMessageEmojis : []
                },
                card: {
                    enabled: body.card?.enabled ?? false,
                    in_embed: body.card?.inEmbed ?? false,
                    background: body.card?.background ?? undefined,
                    text_color: typeof body.card?.textColor === "number"
                        ? body.card.textColor : undefined
                },
                button: {
                    enabled: body.button?.enabled ?? false,
                    style: [1, 2, 3, 4].includes(body.button?.style) ? body.button.style : 1,
                    type: 0,
                    emoji: body.button?.emoji ?? null,
                    label: body.button?.label ?? null,
                    ping: body.button?.ping ?? false
                },
                created_at: now,
                updated_at: now
            });

            return c.json(newConfig);
        }

        // UPDATE existing configuration
        const keys: UpdatableFields[] = [
            "enabled",
            "channelId",
            "roleIds",
            "pingIds",
            "delete_after",
            "delete_after_leave",
            "restore"
        ];

        for (const key of keys) {
            if (!(key in body)) continue;

            const dbKey = keyMap[key];

            if (key === "roleIds" || key === "pingIds") {
                const value = Array.isArray(body[key])
                    ? body[key].map(String)
                    : [];
                (config as any)[dbKey] = value;
            } else {
                (config as any)[dbKey] = body[key];
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
                welcome_message_emojis: Array.isArray(body.reactions.welcomeMessageEmojis)
                    ? body.reactions.welcomeMessageEmojis
                    : config.reactions?.welcome_message_emojis ?? [],
                first_message_emojis: Array.isArray(body.reactions.firstMessageEmojis)
                    ? body.reactions.firstMessageEmojis
                    : config.reactions?.first_message_emojis ?? []
            };
        }

        if (typeof body.card === "object" && body.card !== null) {
            config.card = {
                enabled: typeof body.card.enabled === "boolean"
                    ? body.card.enabled
                    : config.card?.enabled ?? false,
                in_embed: typeof body.card.inEmbed === "boolean"
                    ? body.card.inEmbed
                    : config.card?.in_embed ?? false,
                background: "background" in body.card
                    ? body.card.background
                    : config.card?.background ?? undefined,
                text_color: typeof body.card.textColor === "number"
                    ? body.card.textColor
                    : config.card?.text_color ?? undefined
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

        config.updated_at = now;
        if (!config.created_at) {
            config.created_at = now;
        }


        const updatedConfig = await upsertWelcome(config);
        return c.json(updatedConfig);

    } catch {
        return c.json({ error: "Internal server error" }, 500);
    }
});

router.post("/test", async (c) => {
    const guildId = c.req.param("guildId");
    const user = c.get("user");

    try {
        const config = await getWelcome(guildId!);

        if (!config || !config.channel_id) {
            return httpError(HttpErrorMessage.ChannelNotFound);
        }

        const content = config.message?.content?.trim() || `Hello @${user?.username}`;
        const embed = config.message?.embed ?? null;

        const payload: TestPayload = {};
        if (content) payload.content = content;
        if (embed) payload.embeds = [embed];

        const res = await fetch(`https://discord.com/api/v10/channels/${config.channel_id}/messages`, {
            method: "POST",
            headers: {
                Authorization: `Bot ${appConfig.client.token}`,
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