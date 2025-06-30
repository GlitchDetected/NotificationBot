import { Hono } from 'hono';

import Tpa from "../../../database/models/tpa";

const router = new Hono();

/**
 * GET /dashboard/thirdpartyannouncements?guildId=GUILD_ID
 * Fetch the tpa configuration for a specific guild.
 */
router.get("/", async (c) => {
  const guildId = c.req.query;
  if (!guildId) {
    return c.json({ message: "guildId is required" });
  }

  try {
    const config = await Tpa.findOne({ where: { guildId } });
    if (!config) {
      return c.json({ message: "No configuration found for this guild." });
    }
    return c.json({ config });
  } catch (error) {
    console.error("Error fetching tpa configuration:", error);
    return c.json({ message: "Error fetching tpa configuration", error });
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
router.post("/", async (c) => {
  const {
    guildId,
    tpaEnabled,
    youtubeDiscordChannelId,
    youtubeChannelUrl,
    tiktokDiscordChannelId,
    tiktokChannelUrl,
    twitchDiscordChannelId,
    twitchChannelUrl
  } = await c.req.json();

  if (!guildId) {
    return c.json({ message: "guildId is required" });
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

    return c.json({ config });
  } catch (error) {
    console.error("Error creating/updating rank configuration:", error);
    return c.json({ message: "Error creating/updating rank configuration", error });
  }
});

/**
 * DELETE /dashboard/thirdpartyannouncements?guildId=GUILD_ID
 * Delete a guild's rank configuration.
 */
router.delete("/", async (c) => {
  const guildId = c.req.query;
  if (!guildId) {
    return c.json({ message: "guildId is required" });
  }

  try {
    const deletedCount = await Tpa.destroy({ where: { guildId } });
    if (!deletedCount) {
      return c.json({ message: "No configuration found for this guild to delete." });
    }
    return c.json({ message: "Configuration deleted successfully." });
  } catch (error) {
    console.error("Error deleting TPA configuration:", error);
    return c.json({ message: "Error deleting TPA configuration", error });
  }
});

export default router;
