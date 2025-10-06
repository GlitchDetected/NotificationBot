import { ShardingManager } from "discord.js";

import config from "../config";

const manager = new ShardingManager("../index.ts", {
    token: config.client.token,
    totalShards: "auto"
});

manager.on("shardCreate", (shard) => {
    console.log(`Launched shard ${shard.id}`);
});

manager.spawn();