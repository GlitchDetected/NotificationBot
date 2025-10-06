import type { Client } from "discord.js";

import { upsertShard } from "../db/models/shard";

export default (client: Client) => {
    const saveShardStatus = async () => {
        try {
            if (!client.application) {
                console.error("Bot is not logged in or application object is not available.");
                return;
            }

            const uptimeMs = client.uptime ?? 0;
            const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((uptimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((uptimeMs % (1000 * 60)) / 1000);
            const uptime = `${days}d:${hours}h:${minutes}m:${seconds}s`;

            const shardId = client.shard?.ids?.[0] ?? 0;

            const shardPayload = {
                id: shardId,
                name: `Shard ${shardId}`,
                ping: client.ws.ping,
                uptime,
                memory: Number((process.memoryUsage().rss / 1024 / 1024).toFixed(2)), // MB
                guilds: client.guilds.cache.size,
                users: client.guilds.cache.reduce((acc, guild) => acc + (guild.memberCount ?? 0), 0)
            };

            await upsertShard(shardPayload);
            console.log(`Shard ${shardId} status successfully saved to DB`);
        } catch (error) {
            console.error("Error saving shard status to DB:", error);
        }
    };

    // Run immediately on startup
    saveShardStatus();

    // Schedule to run every 5 minutes (5 * 60 * 1000 ms)
    setInterval(saveShardStatus, 5 * 60 * 1000);
};