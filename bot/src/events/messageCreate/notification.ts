import type { Client, Guild, Message } from "discord.js";

import { notificationPlaceholders } from "@/src/constants/discord";
import Notifications from "@/src/database/models/notifications";
import { fetchers } from "@/src/lib/getUploads";
import { replacePlaceholder } from "@/src/utils/replacePlaceholder";
import type { ContentData, notificationConfig, NotificationType } from "@/typings";

export default async (
    _client: Client,
    _message: Message,
    notificationId: string,
    guild: Guild,
    config: notificationConfig,
    type: NotificationType,
    contentData: ContentData
) => {
    const placeholders = {
        ...notificationPlaceholders(guild, config, type, contentData)
    };

    const dbConfig = await Notifications.findOne({ where: { id: notificationId } });
    if (!dbConfig || !dbConfig.id || !dbConfig.guildId) return;

    if (dbConfig.type !== type) {
        return;
    }

    const fetcher = fetchers[type];
    if (!fetcher) return;

    const latestContent = await fetcher(config);
    if (!latestContent || !latestContent.link) return;

    const channel = guild.channels.cache.get(dbConfig.channelId);
    if (!channel || !channel.isTextBased()) return;

    let content = replacePlaceholder(dbConfig.message?.content || "", placeholders);

    content += `\n${latestContent.link}`;

    console.log("Fetched content:", latestContent);

    if (dbConfig.roleId) {
        content = `<@&${dbConfig.roleId}> ${content}`;
    }

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
                    icon_url: footer.icon_url ? replacePlaceholder(footer.icon_url, placeholders) : undefined
                }
                : undefined
        };

        await channel.send({
            content,
            embeds: [embed]
        });
    } else {
        await channel.send({
            content
        });
    }
};