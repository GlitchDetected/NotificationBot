import express, { Request, Response, Router } from "express";

import Tpa from "../../../database/models/tpa";

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
    const config = await Tpa.findOne({ where: { guildId } });
    if (!config) {
      return res.status(404).json({ message: "No configuration found for this guild." });
    }
    return res.status(200).json({ config });
  } catch (error) {
    console.error("Error fetching tpa configuration:", error);
    return res.status(500).json({ message: "Error fetching tpa configuration", error });
  }
});

/**
 * POST locahost:3001/dashboard/thirdpartyannouncements
 * Create or update the tpa configuration.
 *
 * Expected JSON payload:
 * {
 *   guildId: string,
 *   tpaEnabled?: boolean
 *   youtubeDiscordChannelId?: string,
 *   youtubeChannelUrl?: string,
 *   tiktokDiscordChannelId?: string,
 *   tiktokChannelUrl?: string,
 *   twitchDiscordChannelId?: string,
 *   twitchChannelUrl?: string
 * }
 */
router.post("/", async (req: Request, res: Response): Promise<any> => {
  const {
    guildId,
    tpaEnabled,
    youtubeDiscordChannelId,
    youtubeChannelUrl,
    tiktokDiscordChannelId,
    tiktokChannelUrl,
    twitchDiscordChannelId,
    twitchChannelUrl
  } = req.body;

  if (!guildId) {
    return res.status(400).json({ message: "guildId is required" });
  }

  try {
    // Find an existing configuration for the guild, if any.
    let config = await Tpa.findOne({ where: { guildId } });

    if (config) {
      // Update existing
      if (typeof tpaEnabled !== "undefined") {
        config.set("tpaEnabled", tpaEnabled);
      }
      if (typeof youtubeDiscordChannelId !== "undefined") {
        config.set("youtubeDiscordChannelId", youtubeDiscordChannelId);
      }
      if (typeof youtubeChannelUrl !== "undefined") {
        config.set("youtubeChannelUrl", youtubeChannelUrl);
      }
      if (typeof tiktokDiscordChannelId !== "undefined") {
        config.set("tiktokDiscordChannelId", tiktokDiscordChannelId);
      }
      if (typeof tiktokChannelUrl !== "undefined") {
        config.set("tiktokChannelUrl", tiktokChannelUrl);
      }
      if (typeof twitchDiscordChannelId !== "undefined") {
        config.set("twitchDiscordChannelId", twitchDiscordChannelId);
      }
      if (typeof twitchChannelUrl !== "undefined") {
        config.set("twitchChannelUrl", twitchChannelUrl);
      }
      await config.save();
    } else {
      // Create a new record
      config = await Tpa.create({
        guildId,
        tpaEnabled,
        youtubeDiscordChannelId,
        youtubeChannelUrl,
        tiktokDiscordChannelId,
        tiktokChannelUrl,
        twitchDiscordChannelId,
        twitchChannelUrl
      });
    }

    return res.status(200).json({ config });
  } catch (error) {
    console.error("Error creating/updating rank configuration:", error);
    return res.status(500).json({ message: "Error creating/updating rank configuration", error });
  }
});

/**
 * DELETE /dashboard/thirdpartyannouncements?guildId=GUILD_ID
 * Delete a guild's rank configuration.
 */
router.delete("/", async (req: Request, res: Response): Promise<any> => {
  const { guildId } = req.query;
  if (!guildId) {
    return res.status(400).json({ message: "guildId is required" });
  }

  try {
    const deletedCount = await Tpa.destroy({ where: { guildId } });
    if (!deletedCount) {
      return res.status(404).json({ message: "No configuration found for this guild to delete." });
    }
    return res.status(200).json({ message: "Configuration deleted successfully." });
  } catch (error) {
    console.error("Error deleting TPA configuration:", error);
    return res.status(500).json({ message: "Error deleting TPA configuration", error });
  }
});

export default router;
