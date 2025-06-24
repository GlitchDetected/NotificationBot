import express, { Request, Response, Router } from "express";

import feednotifications from "../../../database/models/feednotifications";

const router: Router = express.Router();
router.use(express.json());

/**
 * GET /dashboard/thirdpartyannouncements?guildId=GUILD_ID
 * Fetch the tpa configuration for a specific guild.
 */
router.get("/", async (req: Request, res: Response): Promise<any> => {
  const { guildId } = req.query;
  if (!guildId) {
    return res.status(400).json({ message: "guildId is required" });
  }

  try {
    const config = await feednotifications.findOne({ where: { guildId } });
    if (!config) {
      return res.status(404).json({ message: "No configuration found for this guild." });
    }
    return res.status(200).json({ config });
  } catch (error) {
    console.error("Error fetching feednotifications configuration:", error);
    return res.status(500).json({ message: "Error fetching feednotifications configuration", error });
  }
});

/**
 * POST locahost:3001/dashboard/thirdpartyannouncements
 * Create or update the tpa configuration.
 *
 *  Expected JSON payload:
 * {
 *   "feed 1": {
 *     guildId: string,
 *     rssChannelId: string,
 *     rssLink: string,
 *     rssPingRoleId: string
 *   },
 *   "feed 2": {
 *     guildId: string,
 *     rssChannelId: string,
 *     rssLink: string,
 *     rssPingRoleId: string
 *   },
 *   ... and so on
 * }
 */
router.post("/", async (req: Request, res: Response): Promise<any> => {
  const body = req.body;

  if (!body || typeof body !== "object") {
    return res.status(400).json({ message: "Invalid payload format" });
  }

  const entries = Object.entries(body) as [string, any][];

  if (entries.length === 0) {
    return res.status(400).json({ message: "No feeds provided" });
  }

  try {
    const results = [];

    for (const [key, value] of entries) {
      if (!key.startsWith("feed")) continue;

      const { guildId, rssChannelId, rssLink, rssPingRoleId } = value;

      if (!guildId) {
        return res.status(400).json({ message: "guildId is required" });
      }

      // Find an existing configuration for the guild, if any.
      let config = await feednotifications.findOne({ where: { guildId } });

      if (config) {
        // Update existing
        config.set("rssChannelId", rssChannelId);
        config.set("rssLink", rssLink);
        config.set("rssPingRoleId", rssPingRoleId);
        await config.save();
      } else {
        // Create a new record
        config = await feednotifications.create({
          guildId,
          feedCountKey: key,
          rssChannelId,
          rssLink,
          rssPingRoleId
        });
      }
      results.push(config);
    }

    return res.status(200).json({ config: results });
  } catch (error) {
    console.error("Error creating/updating feednotifications configuration:", error);
    return res.status(500).json({
      message: "Error creating/updating feednotifications configuration",
      error
    });
  }
});

/**
 * DELETE /dashboard/feednotifications?guildId=GUILD_ID
 * Delete a guild's feednotifications configuration.
 */
router.delete("/", async (req: Request, res: Response): Promise<any> => {
  const { guildId } = req.query;
  if (!guildId) {
    return res.status(400).json({ message: "guildId is required" });
  }

  try {
    const deletedCount = await feednotifications.destroy({ where: { guildId } });
    if (!deletedCount) {
      return res.status(404).json({ message: "No configuration found for this guild to delete." });
    }
    return res.status(200).json({ message: "Configuration deleted successfully." });
  } catch (error) {
    console.error("Error deleting feednotifications configuration:", error);
    return res.status(500).json({ message: "Error deleting feednotifications configuration", error });
  }
});

export default router;
