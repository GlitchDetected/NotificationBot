import { Client } from 'discord.js';
import ts from "typescript";
import os from "os";

export async function postStatus(client: Client) {
  try {
    if (!client.application) {
      console.error("Bot is not logged in or application object is not available.");
      return;
    }

    const timestamp = client.uptime;

    if (timestamp === null) {
      await console.log("Sorry, I could not retrieve the uptime at the moment.");
      return;
    }

    const days = Math.floor(timestamp / (1000 * 60 * 60 * 24));
    const hours = Math.floor(timestamp / (1000 * 60 * 60));
    const minutes = Math.floor((timestamp % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timestamp % (1000 * 60)) / 1000);

    const uptime = `${days}d:${hours}h:${minutes}m:${seconds}s`;

    const presence = client.user?.presence?.status;

    const guildCount = client.guilds.cache.size;
    const userCount = client.guilds.cache.reduce((acc, guild) => acc + (guild.memberCount ?? 0), 0);
    const latency = client.ws.ping;

    await client.application.commands.fetch();
    const commandCount = client.application.commands.cache.size;

      const memoryUsage = Number((process.memoryUsage().rss / 1024 / 1024).toFixed(2)); // MB
      const cpuUsage = process.cpuUsage(); 

      const typescriptVersion = ts.version;

      const platform = os.platform();

      const cpuModel = os.cpus()[0]?.model || "Unknown";

    const payload = {
  presence: presence,
  discord_bot: "connected",
  bot: {
    guilds: guildCount,
    users: userCount,
    latency: latency,
    commands_loaded: commandCount,
  },
  system: {
    cpu_usage: cpuUsage,
    memory_usage: memoryUsage,
  },
  uptime: uptime,
  environment: {
    typescript_version: typescriptVersion,
    platform: platform,
    processor: cpuModel,
  },
  data_source: "external_service",
};

fetch(`${process.env.backenduri}/status`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
})
  .then(async (res) => {
    const data = await res.json();
    console.log("POST success:", data);
  })
  .catch((err) => {
    console.error("POST error:", err);
  });

  } catch (error) {
    console.error("Error fetching status data:", error);
  }
}