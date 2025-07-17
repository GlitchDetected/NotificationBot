import { createCanvas, loadImage } from "@napi-rs/canvas";
import type { Client, GuildMember, User } from "discord.js";
import { AttachmentBuilder } from "discord.js";

import { welcomerPlaceholders } from "@/src/constants/discord";
import Bye from "@/src/database/models/bye";
import Welcome from "@/src/database/models/welcome";
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

    const placeholders = {
        ...welcomerPlaceholders(member, inviter, inviteCode, inviteCount)
    };

    const config = await Bye.findOne({
        where: { guildId: guild.id }
    });

    if (!config || !config.enabled || !config.channelId) return;

    const channel = guild.channels.cache.get(config.channelId);
    if (!channel || !channel.isTextBased()) return;

    const content = replacePlaceholder(config.message?.content || "", placeholders);

    // delete welcome message after leave
    const welcomeConfig = await Welcome.findOne({ where: { guildId: guild.id } });

    const messageId = welcomeConfig?.welcomeMessageIds[member.id];
    if (!messageId) return;

    if (!welcomeConfig || !welcomeConfig.welcomeMessageIds || !welcomeConfig.channelId) return;
    const welcomeChannel = guild.channels.cache.get(welcomeConfig.channelId);
    if (!welcomeChannel || !welcomeChannel.isTextBased()) return;
    try {
        const msg = await welcomeChannel.messages.fetch(messageId);
        if (msg) await msg.delete();
    } catch {
        return;
    }
    await Welcome.update({ welcomeMessageId: null }, { where: { guildId: guild.id } });

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
            embeds: [embed]
        });
    } else {
        sentMessage = await channel.send({ content });
    }

    if (config.deleteAfter && Number.isFinite(config.deleteAfter)) {
        setTimeout(() => {
            sentMessage.delete().catch(() => {});
        }, config.deleteAfter);
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
};