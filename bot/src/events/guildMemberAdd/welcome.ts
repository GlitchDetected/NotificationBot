import type { Client, GuildMember, User } from "discord.js";

import { guildInfo, guildMemberInfo, inviterInfo } from "@/constants/discord";
import Welcome from "@/database/models/welcome";
import { replacePlaceholder } from "@/utils/replacePlaceholder";

export default async (
    _client: Client,
    member: GuildMember,
    inviter: User | null,
    inviteCode?: string,
    inviteCount?: number
) => {
    const { guild } = member;

    const placeholders = {
        ...guildMemberInfo(member),
        ...guildInfo(member),
        ...inviterInfo(inviter, inviteCode, inviteCount)
    };

    const config = await Welcome.findOne({
        where: { guildId: guild.id }
    });

    if (!config || !config.enabled || !config.channelId) return;

    const channel = guild.channels.cache.get(config.channelId);
    if (!channel || !channel.isTextBased()) return;

    const content = replacePlaceholder(config.message?.content || "", placeholders);

    if (config.message?.embed) {
        const { title, description, color, image, thumbnail, footer } = config.message.embed;

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
        await channel.send({ content });
    }

    if (config.dm?.enabled) {
        try {
            const content = replacePlaceholder(config.dm.message?.content || "", placeholders);

            if (config.dm.message?.embed) {
                const { title, description, color, image, thumbnail, footer } = config.dm.message.embed;

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

                await member.send({
                    content: content,
                    embeds: [embed]
                });
            } else if (content) {
                await member.send({ content: content });
            }
        } catch (err) {
            console.warn(err);
        }
    }

    if (config.roleIds?.length) {
        for (const roleId of config.roleIds) {
            try {
                const role = guild.roles.cache.get(roleId);
                if (role) await member.roles.add(role);
            } catch (err) {
                console.error(err);
            }
        }
    }
};