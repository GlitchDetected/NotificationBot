import express, { Request, Response, Router } from "express";
import { DataTypes } from "sequelize";
import db from "../../../database/index";
import redis from "../../../lib/redis";

const router: Router = express.Router();

const Rank = db.define(
  "Rank",
  {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    guildId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    xp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lastDaily: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "Rank",
    timestamps: true,
  }
);

// GET /dashboard/leaderboard?guildId=GUILD_ID
router.get("/", async (req: Request, res: Response): Promise<any> => {
  if (!req.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const { guildId } = req.query;

  if (!guildId) {
    return res.status(400).json({ message: "Guild ID is required" });
  }

  const cacheKey = `guild-ranks:${guildId}`;
  const cachedRanks = await redis.get(cacheKey);

  if (cachedRanks) {
    return res.status(200).json(JSON.parse(cachedRanks));
  }

  try {
    // Use Sequelize's findAll method to fetch all users' ranks for the given guild,
    // ordered by xp in descending order.
    const ranks = await Rank.findAll({
      attributes: ["userId", "guildId", "xp", "level", "lastDaily"],
      where: { guildId },
      order: [["xp", "DESC"]],
    });

    if (!ranks || ranks.length === 0) {
      return res.status(404).json({ message: "No rank data found for this guild" });
    }

    // Cache the ranks data for 10 minutes (600 seconds)
    await redis.set(cacheKey, JSON.stringify(ranks), "EX", 600);

    res.status(200).json({ ranks });
  } catch (error) {
    console.error("Error fetching ranks:", error);
    res.status(500).json({ message: "Error fetching ranks", error });
  }
});

export default router;
