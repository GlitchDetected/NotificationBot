import { createCanvas, loadImage } from "@napi-rs/canvas";
import type { Client, GuildMember, User } from "discord.js";
import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

import { welcomerPlaceholders } from "@/src/constants/discord";
import { getWelcome, updateWelcome } from "@/src/db/models/welcome";
import { replacePlaceholder } from "@/src/utils/replacePlaceholder";

export default async (
    _client: Client,
    member: GuildMember,
    inviter: User | null,
    inviteCode?: string,
    inviteCount?: number
) => {
    const { guild } = member;

    let sentMessage;
    const components: ActionRowBuilder<ButtonBuilder>[] = [];

    const placeholders = {
        ...welcomerPlaceholders(member, inviter, inviteCode, inviteCount)
    };

    const config = await getWelcome(guild.id);

    if (!config || !config.enabled || !config.channelId) return;

    const channel = guild.channels.cache.get(config.channelId);
    if (!channel || !channel.isTextBased()) return;

    const content = replacePlaceholder(config.message?.content || "", placeholders);

    if (config.button?.enabled) {
        const button = new ButtonBuilder()
            .setStyle(config.button.style || ButtonStyle.Primary)
            .setCustomId("welcome-button")
            .setDisabled(false)
            .setLabel(config.button.label || "Say hi");

        if (config.button.emoji) {
            button.setEmoji(config.button.emoji);
        }

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
        components.push(row);
    }

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

        sentMessage = await channel.send({
            content,
            embeds: [embed],
            components
        });
    } else {
        sentMessage = await channel.send({
            content,
            components
        });
    }

    if (config.deleteAfterLeave) {
        const welcomeMessageIds = { ...(config.welcomeMessageIds || {}) };
        welcomeMessageIds[member.id] = sentMessage.id;
        await updateWelcome(guild.id, { welcomeMessageIds });

    }

    if (config.deleteAfter && Number.isFinite(config.deleteAfter)) {
        setTimeout(() => {
            sentMessage.delete().catch(() => {});
        }, config.deleteAfter);
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

    if (config.card?.enabled) {
        try {
            const { inEmbed, background, textColor } = config.card;

            const canvas = createCanvas(1024, 450);
            const ctx = canvas.getContext("2d");

            const bgImage = await loadImage(
                background || "https://i.imgur.com/zvWTUVu.jpg"
            );
            ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

            ctx.font = "bold 36px Sans";
            ctx.fillStyle = textColor ? `#${textColor.toString(16).padStart(6, "0")}` : "#ffffff";
            ctx.fillText(member.user.username, 320, 100);

            ctx.font = "28px Sans";
            ctx.fillStyle = "#dddddd";
            ctx.fillText(`Welcome to ${member.guild.name}`, 320, 200);

            const avatar = await loadImage(
                member.user.displayAvatarURL({ extension: "png", size: 256 })
            );
            ctx.save();
            ctx.beginPath();
            ctx.arc(160, 225, 100, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, 60, 125, 200, 200);
            ctx.restore();

            const buffer = canvas.toBuffer("image/png");
            const attachment = new AttachmentBuilder(buffer, { name: "welcome.png" });

            if (inEmbed) {
                await channel.send({
                    embeds: [
                        {
                            image: { url: "attachment://welcome.png" }
                        }
                    ],
                    files: [attachment]
                });
            } else {
                await channel.send({ files: [attachment] });
            }

        } catch (err) {
            console.warn("Failed to generate welcome card:", err);
        }
    }

    if (config.reactions?.welcomeMessageEmojis?.length && sentMessage) {
        for (const emoji of config.reactions.welcomeMessageEmojis) {
            try {
                await sentMessage.react(emoji);
            } catch (err) {
                console.warn(err);
            }
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

    if (config.pingIds?.length) {
        for (const channelId of config.pingIds) {
            try {
                const pingChannel = guild.channels.cache.get(channelId);
                if (!pingChannel || !pingChannel.isTextBased()) continue;

                const ghostMessage = await pingChannel.send(`<@${member.id}>`);
                setTimeout(() => ghostMessage.delete().catch(() => {}), 3000);
            } catch (err) {
                console.error(`Failed to ghost ping in ${channelId}`, err);
            }
        }
    }
};