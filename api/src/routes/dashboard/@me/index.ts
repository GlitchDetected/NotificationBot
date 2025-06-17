import express, { Request, Response, Router } from "express";
import { hasPermissions } from "../../../lib/utils";
import redis from "../../../lib/redis";
import db from "../../../database/index";
import { DataTypes } from "sequelize";

const router: Router = express.Router();
const DISCORD_ENDPOINT = "https://discord.com/api/v10";

const Prefix = db.define(
  "Prefix",
  {
    guildId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    prefix: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Prefix",
    timestamps: false,
  }
);

router.use(express.json());

router.get("/", (req: Request, res: Response) => {
  if (req.user) {
    const { accessToken, refreshToken, ...user } = req.user;
    res.status(200).json(user);
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
});

router.get("/guilds", async (req: Request, res: Response): Promise<any> => {
  if (!req.user?.accessToken) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const skipCache = req.query.skipcache;

  if (!skipCache) {
    const redisCacheRes = await redis.get(`user-guilds:${req.user.id}`);

    if (redisCacheRes) {
      return res.status(200).json(JSON.parse(redisCacheRes));
    }
  }

  // Fetch the user's guilds
  const guildsRes = await fetch(`${DISCORD_ENDPOINT}/users/@me/guilds`, {
    headers: {
      Authorization: `Bearer ${req.user.accessToken}`
    }
  });

  if (!guildsRes.ok) {
    return res.status(500).json({ message: "Failed to fetch guilds" });
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
    return res.status(500).json({ message: "Failed to fetch bot's guilds" });
  }

  const botGuilds = await botGuildsRes.json();

  const guildsWithBot = await Promise.all(filteredGuilds.map(async (guild: any) => {
    const botInGuild = botGuilds.some((botGuild: any) => botGuild.id === guild.id);

    let channels = [];
if (botInGuild) { // if bot is in the guild, fetch channels
  const channelsRes = await fetch(`${DISCORD_ENDPOINT}/guilds/${guild.id}/channels`, {
    headers: {
      Authorization: `Bot ${process.env.BOT_TOKEN}`
    }
  });

  if (channelsRes.ok) {
    const rawChannels = await channelsRes.json();
    channels = rawChannels.filter(
      (channel: { type: number }) => channel.type !== 4 && channel.type !== 2
    );
  } else {
    console.warn(`Bot is in guild ${guild.id} but failed to fetch channels`);
  }
}

    // console.log("Filtered Guilds:", filteredGuilds);

    let botPrefix = ";";
    const prefixEntry = await Prefix.findOne({ where: { guildId: guild.id } });
    if (prefixEntry) botPrefix = prefixEntry.getDataValue("prefix");

    return {
      ...guild,
      botInGuild,
      botPrefix,
      channels
    };
  }));

  await redis.set(
    `user-guilds:${req.user.id}`, 
    JSON.stringify(guildsWithBot), 
    "EX", 
    600
  );

  res.status(200).json(guildsWithBot);
});

router.post("/guilds", async (req: Request, res: Response): Promise<any> => {
  if (!req.user?.accessToken) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const { guildId, prefix } = req.body;

  if (!guildId || !prefix) {
    return res.status(400).json({ message: "Missing guildId or prefix" });
  }

  if (prefix.length > 3) {
    return res.status(400).json({ message: "Invalid prefix (max 3 characters)" });
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
    const cachedGuilds = await redis.get(`user-guilds:${req.user.id}`);
    if (cachedGuilds) {
      const guilds = JSON.parse(cachedGuilds);
      const updatedGuilds = guilds.map((g: any) =>
        g.id === guildId ? { ...g, botPrefix: prefix } : g
      );
      await redis.set(`user-guilds:${req.user.id}`, JSON.stringify(updatedGuilds), "EX", 600);
    }

    res.status(200).json({ success: true, botPrefix: prefix });
  } catch (error) {
    console.error("Error updating prefix:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;