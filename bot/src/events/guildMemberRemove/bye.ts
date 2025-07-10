import type { Client, GuildMember } from "discord.js";

import { guildMemberInfo } from "@/constants/discord";
import Bye from "@/database/models/bye";
import { replacePlaceholder } from "@/utils/replacePlaceholder";

export default async (_client: Client, member: GuildMember) => {
    const { guild, mention, username } = guildMemberInfo(member);

    const config = await Bye.findOne({
        where: { guildId: guild.id }
    });

    if (!config || !config.enabled || !config.channelId) return;

    const channel = guild.channels.cache.get(config.channelId);
    if (!channel || !channel.isTextBased()) return;

    const content = replacePlaceholder(config.message?.content || "", {
        username,
        mention
    });

    if (config.message?.embed) {
        const { title, description, color, image, thumbnail, footer } = config.message.embed;

        const embed = {
            title: title || undefined,
            description: description || undefined,
            color: color || 0x333333,
            image: image ? { url: image } : undefined,
            thumbnail: thumbnail ? { url: thumbnail } : undefined,
            footer: footer?.text
                ? { text: footer.text, icon_url: footer.icon_url || undefined }
                : undefined
        };

        await channel.send({
            content,
            embeds: [embed]
        });
    } else {
        await channel.send({ content });
    }
};