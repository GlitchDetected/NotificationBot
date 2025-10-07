import type { Client, GuildMember, TextChannel } from "discord.js";

import envConfig from "@/src/config";

import { getFollowUpdates } from "../../db/models/followupdates";

export default async (client: Client, member: GuildMember) => {
    const { guild } = member;

    const config = await getFollowUpdates(guild.id);
    if (!config?.channel_id) {
        console.warn(`⚠️ No follow update channel configured for guild ${guild.id}`);
        return;
    }

    const updateGuild = await client.guilds.fetch(envConfig.guildId).catch(() => null);
    if (!updateGuild) {
        console.error(`❌ Update guild (${envConfig.guildId}) not found.`);
        return;
    }

    const updateChannel = updateGuild.channels.cache.get(envConfig.updatesChannel) as TextChannel | undefined;
    if (!updateChannel) {
        console.error(`❌ Update channel (${envConfig.updatesChannel}) not found in guild ${envConfig.guildId}.`);
        return;
    }

    const followChannel = await client.channels.fetch(config.channel_id).catch(() => null) as TextChannel | null;
    if (!followChannel) {
        console.warn(`⚠️ Invalid follow channel (${config.channel_id}) for guild ${guild.id}`);
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