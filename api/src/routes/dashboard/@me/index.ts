import { Hono } from 'hono';

import { hasPermissions } from "../../../lib/utils";
import redis from "../../../lib/redis";
import db from "../../../database/index";
import { DataTypes } from "sequelize";

const router = new Hono();

const DISCORD_ENDPOINT = "https://discord.com/api/v10";

const Prefix = db.define(
  "Prefix",
  {
    guildId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    prefix: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "Prefix",
    timestamps: false
  }
);

router.get("/", async (c) => {
  const user = (c.req as any).user;

  if (user) {
    const { accessToken, refreshToken, ...userWithoutTokens } = user;
    return c.json(userWithoutTokens);
  } else {
    return c.json({ message: "Not logged in" });
  }
});

router.get("/guilds", async (c) => {
  const user = (c.req as any).user;
  if (!user?.accessToken) {
     return c.json({ message: "Not logged in" });
  }

  const url = new URL(c.req.url, "http://localhost");
  const skipCache = url.searchParams.get("skipcache");

  if (!skipCache) {
    const redisCacheRes = await redis.get(`user-guilds:${user.id}`);

    if (redisCacheRes) {
       return c.json(JSON.parse(redisCacheRes));
    }
  }

  // Fetch the user's guilds
  const guildsRes = await fetch(`${DISCORD_ENDPOINT}/users/@me/guilds`, {
    headers: {
      Authorization: `Bearer ${user.accessToken}`
    }
  });

  if (!guildsRes.ok) {
    return c.json({ message: "Failed to fetch guilds" });
  }

  const guilds = await guildsRes.json();

  // Filter user's guilds where they have the "ManageGuild" permission
  const filteredGuilds = guilds.filter((guild: { permissions: any }) =>
    hasPermissions(guild.permissions, "ManageGuild")
  );

  // Fetch the bot's guilds
  const botGuildsRes = await fetch(`${DISCORD_ENDPOINT}/users/@me/guilds`, {
    headers: {
      Authorization: `Bot ${process.env.BOT_TOKEN}`
    }
  });

  if (!botGuildsRes.ok) {
    return c.json({ message: "Failed to fetch bot's guilds" });
  }

  const botGuilds = await botGuildsRes.json();

  const guildsWithBot = await Promise.all(
    filteredGuilds.map(async (guild: any) => {
      const botInGuild = botGuilds.some((botGuild: any) => botGuild.id === guild.id);

      let channels = [];
      let roles = [];
      if (botInGuild) {
        // if bot is in the guild, fetch channels and roles

        const channelsRes = await fetch(`${DISCORD_ENDPOINT}/guilds/${guild.id}/channels`, {
          headers: {
            Authorization: `Bot ${process.env.BOT_TOKEN}`
          }
        });

        if (channelsRes.ok) {
          const rawChannels = await channelsRes.json();
          channels = rawChannels.filter((channel: { type: number }) => channel.type !== 4 && channel.type !== 2);
        } else {
          console.warn(`Bot is in guild ${guild.id} but failed to fetch channels`);
        }

        const rolesRes = await fetch(`${DISCORD_ENDPOINT}/guilds/${guild.id}/roles`, {
          headers: {
            Authorization: `Bot ${process.env.BOT_TOKEN}`
          }
        });

        if (rolesRes.ok) {
          const rawRoles = await rolesRes.json();
          roles = rawRoles;
        } else {
          console.warn(`Bot is in guild ${guild.id} but failed to fetch roles`);
        }
      }

      // console.log(filteredGuilds);

      let botPrefix = ";";
      const prefixEntry = await Prefix.findOne({ where: { guildId: guild.id } });
      if (prefixEntry) botPrefix = prefixEntry.getDataValue("prefix");

      return {
        ...guild,
        botInGuild,
        botPrefix: ";",
        channels,
        roles
      };
    })
  );

  await redis.set(`user-guilds:${user.id}`, JSON.stringify(guildsWithBot), "EX", 600);

  return c.json(guildsWithBot);
  
router.post("/guilds", async (c) => {
  const user = (c.req as any).user;
  if (!user?.accessToken) {
    return c.json({ message: "Not logged in" });
  }

  const body = await c.req.json();
  const { guildId, prefix } = body;

  if (!guildId || !prefix) {
    return c.json({ message: "Missing guildId or prefix" });
  }

  if (prefix.length > 3) {
    return c.json({ message: "Invalid prefix (max 3 characters)" });
  }

  try {
    // Check if the prefix exists for the guild
    const prefixEntry = await Prefix.findOne({ where: { guildId } });

    if (prefixEntry) {
      // Update existing prefix
      await prefixEntry.update({ prefix });
    } else {
      // Create new prefix entry in PostgreSQL
      await Prefix.create({ guildId, prefix });
    }

    // Update Redis cache
    const cachedGuilds = await redis.get(`user-guilds:${user.id}`);
    if (cachedGuilds) {
      const guilds = JSON.parse(cachedGuilds);
      const updatedGuilds = guilds.map((g: any) => (g.id === guildId ? { ...g, botPrefix: prefix } : g));
      await redis.set(`user-guilds:${user.id}`, JSON.stringify(updatedGuilds), "EX", 600);
    }

    return c.json({ success: true, botPrefix: prefix });
  } catch (error) {
    console.error("Error updating prefix:", error);
    return c.json({ message: "Internal server error" });
  }
});
  });

export default router;
