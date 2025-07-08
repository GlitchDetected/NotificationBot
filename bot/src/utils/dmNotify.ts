import { type Client, EmbedBuilder } from "discord.js";
import Parser from "rss-parser";

import dmnotifications from "@/database/models/dmnotifications";

const parser = new Parser();

export async function dmnotify(client: Client) {
    try {
        const allUsers = await dmnotifications.findAll();

        for (const user of allUsers) {
            try {
                const { userId, embedcolor, source, thumbnail, message } = user;

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
                console.error(`Failed to notify user ${user.userId}:`, err);
            }
        }
    } catch (err) {
        console.error("Failed to run dmnotify function:", err);
    }
}


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