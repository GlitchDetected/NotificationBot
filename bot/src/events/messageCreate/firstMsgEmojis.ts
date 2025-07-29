import type { Client, GuildMember, Message } from "discord.js";

import { getWelcome } from "@/src/db/models/welcome";

export default async (_client: Client, message: Message, member: GuildMember) => {
    const { guild } = member;

    if (message.author.bot || !message.guild) return;

    const config = await getWelcome(guild.id);
    if (!config?.reactions?.first_message_emojis?.length) return;

    for (const emoji of config.reactions.first_message_emojis) {
        try {
            await message.react(emoji);
        } catch (err) {
            console.warn("Failed to react to first message", err);
        }
    }
};