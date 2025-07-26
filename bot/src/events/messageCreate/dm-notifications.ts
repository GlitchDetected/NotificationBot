import { type Client, EmbedBuilder, type Message } from "discord.js";
import Parser from "rss-parser";

import { getDmNotifications } from "@/src/db/models/dmnotifications";

const parser = new Parser();

export default async (client: Client, _message: Message, userId?: string) => {
    try {
        const allUsers = await getDmNotifications(userId);

        for (const user of allUsers) {
            try {

                const { userId, source, message, embedcolor, thumbnail } = user;

                const content = await fetchFromSource(source);
                if (!content) continue;

                const embed = new EmbedBuilder()
                    .setTitle("🔔 Daily Notification")
                    .setDescription(`${message ?? "You got a new notification from"} ${source}`)
                    .addFields({ name: "Content", value: content })
                    .setColor(embedcolor ?? 0x5865f2);

                if (thumbnail) embed.setThumbnail(thumbnail);

                const userObj = await client.users.fetch(userId);
                await userObj.send({ embeds: [embed] });

            } catch (err) {
                console.error("Failed to notify", err);
            }
        }
    } catch (err) {
        console.error("Failed to run dmnotifications function:", err);
    }
};

async function fetchFromSource(source: string | null): Promise<string | null> {
    if (!source) return null;

    try {
        const feed = await parser.parseURL(source);
        const latestItem = feed.items[0];

        if (!latestItem) return null;

        const title = latestItem.title;
        const link = latestItem.link;

        return `**${title}**\n${link}`;
    } catch (err) {
        console.error(`Error fetching RSS feed from ${source}:`, err);
        return null;
    }
}