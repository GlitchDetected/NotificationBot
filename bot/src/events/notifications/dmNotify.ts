import { type Client, EmbedBuilder } from "discord.js";
import Parser from "rss-parser";

import dmnotifications from "@/database/models/dmnotifications";

import type { ApiV1UsersMeGetResponse } from "../../../typings";

const parser = new Parser();

export default async (dmnotificationType: ApiV1UsersMeGetResponse["dmnotifications"], client: Client) => {
    try {
        const allUsers = await dmnotifications.findAll();

        for (const user of allUsers) {
            try {

                const content = await fetchFromSource(dmnotificationType?.source);
                if (!content) continue;

                const embed = new EmbedBuilder()
                    .setTitle("🔔 Daily Notification")
                    .setDescription(`${user.message ?? "You got a new notification from"} ${user.source}`)
                    .addFields({ name: "Content", value: content })
                    .setColor(user.embedcolor ?? 0x5865f2);

                if (user.thumbnail) embed.setThumbnail(user.thumbnail);

                const userObj = await client.users.fetch(user.userId);
                await userObj.send({ embeds: [embed] });

            } catch (err) {
                console.error(`Failed to notify user ${user.userId}:`, err);
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