import type { Client, GuildMember, TextChannel } from "discord.js";

import envConfig from "@/src/config";

import { getFollowUpdates } from "../../db/models/followupdates";

export default async (client: Client, member: GuildMember) => {
    const { guild } = member;

    const config = await getFollowUpdates(guild.id);
    if (!config?.channel_id) {
        return;
    }

    const updateGuild = await client.guilds.fetch(envConfig.guildId).catch(() => null);
    if (!updateGuild) {
        return;
    }

    const updateChannel = updateGuild.channels.cache.get(envConfig.updatesChannel) as TextChannel | undefined;
    if (!updateChannel) {
        return;
    }

    const followChannel = await client.channels.fetch(config.channel_id).catch(() => null) as TextChannel | null;
    if (!followChannel) {
        return;
    }

    setInterval(async () => {
        try {
            // Get the latest message from the update channel
            const messages = await updateChannel.messages.fetch({ limit: 1 });
            const latest = messages.first();
            if (!latest) return;

            // Send update to the guild’s configured follow channel
            await followChannel.send({
                content: `📢 **New Update** from the Notification Bot team:\n${latest.content || "(no text content)"}\n\n[View on Update Server](${latest.url})`
            });

            console.log(`📨 Sent update to guild ${guild.id}: ${latest.id}`);
        } catch (error) {
            console.error(`❌ Error checking updates for guild ${guild.id}:`, error);
        }
    }, 1000 * 60 * 5); // every 5 minutes
};