import type { Client, Message } from "discord.js";

import Welcome from "@/database/models/welcome";
import redis from "@/lib/redis";

export default async (_client: Client, message: Message) => {
    if (message.author.bot || !message.guild) return;

    const seenUser = `seenUser:${message.guild.id}:${message.author.id}`;

    const hasSeen = await redis.get(seenUser);
    if (hasSeen) return;

    await redis.set(seenUser, "1", "EX", 60 * 60 * 24 * 365);

    const config = await Welcome.findOne({ where: { guildId: message.guild.id } });
    if (!config?.reactions?.firstMessageEmojis?.length) return;

    for (const emoji of config.reactions.firstMessageEmojis) {
        try {
            await message.react(emoji);
        } catch (err) {
            console.warn("Failed to react to first message", err);
        }
    }
};