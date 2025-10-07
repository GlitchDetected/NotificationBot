import type { Client, Guild, Message } from "discord.js";

import { notificationPlaceholders } from "@/src/constants/discord";
import { getAllNotifications, getNotificationById } from "@/src/db/models/notifications";
import { fetchers } from "@/src/lib/getUploads";
import { replacePlaceholder } from "@/src/utils/replacePlaceholder";
import type { ContentData, notificationConfig, NotificationType } from "@/typings";

export default async function sendNotification(
    _client: Client,
    _message: Message,
    id: string,
    guild: Guild,
    config: notificationConfig,
    type: NotificationType,
    contentData: ContentData
) {
    const dbConfig = await getNotificationById(id);
    if (!dbConfig || !dbConfig.id || !dbConfig.guild_id || !dbConfig.channel_id) return;
    if (dbConfig.type !== type) return;

    const fetcher = fetchers[type];
    if (!fetcher) return;

    // 🔹 Always fetch latest data
    const latestContent = await fetcher(config);
    if (!latestContent || !latestContent.link) return;

    const channel = guild.channels.cache.get(dbConfig.channel_id);
    if (!channel || !channel.isTextBased()) return;

    const placeholders = {
        ...notificationPlaceholders(guild, config, type, contentData)
    };

    let content = replacePlaceholder(dbConfig.message?.content || "", placeholders);
    content += `\n${latestContent.link}`;

    if (dbConfig.role_id) {
        content = `<@&${dbConfig.role_id}> ${content}`;
    }

    // 🔹 Send message (with embed if defined)
    if (dbConfig.message?.embed) {
        const { title, description, color, image, thumbnail, footer } = dbConfig.message.embed;

        const embed = {
            title: title ? replacePlaceholder(title, placeholders) : undefined,
            description: description ? replacePlaceholder(description, placeholders) : undefined,
            color: color || 0x333333,
            image: image ? { url: replacePlaceholder(image, placeholders) } : undefined,
            thumbnail: thumbnail ? { url: replacePlaceholder(thumbnail, placeholders) } : undefined,
            footer: footer?.text
                ? {
                    text: replacePlaceholder(footer.text, placeholders),
                    icon_url: footer.icon_url
                        ? replacePlaceholder(footer.icon_url, placeholders)
                        : undefined
                }
                : undefined
        };

        await channel.send({ content, embeds: [embed] });
    } else {
        await channel.send({ content });
    }

    console.log(`📨 Sent latest update for ${dbConfig.id} (${type})`);
}

export async function fetchNotifications(client: Client) {
    try {
        const configs = await getAllNotifications();
        for (const config of configs) {
            if (!config.channel_id || !config.id || config.type === null) continue;
            const guild = client.guilds.cache.get(config.guild_id);
            if (!guild) continue;

            try {
                await sendNotification(
                    client,
                    {} as Message,
                    config.id,
                    guild,
                    config as notificationConfig,
                    config.type,
                    {} as ContentData
                );
            } catch (err) {
                console.error(`Error sending notification for ${config.id}:`, err);
            }
        }
    } catch (err) {
        console.error("Error fetching notifications:", err);
    }
}