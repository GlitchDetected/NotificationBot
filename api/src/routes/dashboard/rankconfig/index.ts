import express, { Request, Response, Router } from "express";
import { DataTypes } from "sequelize";
import db from "../../../database/index";

const router: Router = express.Router();
router.use(express.json());

// Define the RankConfigs model inline (corresponding to the "rankconfigs" table)
const RankConfigs = db.define(
  "rankconfigs",
  {
    guildId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    rankchannel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rankconfigure: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "rankconfigs",
    timestamps: true,
  }
);

/**
 * GET /dashboard/rankconfigure?guildId=GUILD_ID
 * Fetch the rank configuration for a specific guild.
 */
router.get("/", async (req: Request, res: Response): Promise<any> => {
  const { guildId } = req.query;
  if (!guildId) {
    return res.status(400).json({ message: "guildId is required" });
  }

  try {
    const config = await RankConfigs.findOne({ where: { guildId } });
    if (!config) {
      return res.status(404).json({ message: "No configuration found for this guild." });
    }
    return res.status(200).json({ config });
  } catch (error) {
    console.error("Error fetching rank configuration:", error);
    return res.status(500).json({ message: "Error fetching rank configuration", error });
  }
});

/**
 * POST locahost:3001/dashboard/rankconfigure
 * Create or update the rank configuration.
 *
 * Expected JSON payload:
 * {
 *   guildId: string,
 *   rankconfigure: boolean, // whether the rank system is enabled
 *   rankchannel?: string    // channel ID for rank messages (optional)
 * }
 */
router.post("/", async (req: Request, res: Response): Promise<any> => {
  const { guildId, rankconfigure, rankchannel } = req.body;

  if (!guildId) {
    return res.status(400).json({ message: "guildId is required" });
  }

  try {
    // Find an existing configuration for the guild, if any.
    let config = await RankConfigs.findOne({ where: { guildId } });

    if (config) {
      // Update existing configuration
      if (typeof rankconfigure !== "undefined") {
        config.set("rankconfigure", rankconfigure);
      }
      if (typeof rankchannel !== "undefined") {
        config.set("rankchannel", rankchannel);
      }
      await config.save();
    } else {
      // Create a new configuration record
      config = await RankConfigs.create({ guildId, rankconfigure, rankchannel });
    }

    return res.status(200).json({ config });
  } catch (error) {
    console.error("Error creating/updating rank configuration:", error);
    return res.status(500).json({ message: "Error creating/updating rank configuration", error });
  }
});

/**
 * DELETE /dashboard/rankconfigure?guildId=GUILD_ID
 * Delete a guild's rank configuration.
 */
router.delete("/", async (req: Request, res: Response): Promise<any> => {
  const { guildId } = req.query;
  if (!guildId) {
    return res.status(400).json({ message: "guildId is required" });
  }

  try {
    const deletedCount = await RankConfigs.destroy({ where: { guildId } });
    if (!deletedCount) {
      return res.status(404).json({ message: "No configuration found for this guild to delete." });
    }
    return res.status(200).json({ message: "Configuration deleted successfully." });
  } catch (error) {
    console.error("Error deleting rank configuration:", error);
    return res.status(500).json({ message: "Error deleting rank configuration", error });
  }
});

export default router;