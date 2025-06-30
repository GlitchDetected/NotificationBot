import { Hono } from 'hono';

import feednotifications from "../../../database/models/feednotifications";

const router = new Hono();

/**
 * GET /dashboard/thirdpartyannouncements?guildId=GUILD_ID
 * Fetch the tpa configuration for a specific guild.
 */
router.get("/", async (c) => {
  const { guildId } = await c.req.json();
  if (!guildId) {
    return c.json({ message: "guildId is required" });
  }

  try {
    const config = await feednotifications.findOne({ where: { guildId } });
    if (!config) {
      return c.json({ message: "No configuration found for this guild." });
    }
    return c.json({ config });
  } catch (error) {
    console.error("Error fetching feednotifications configuration:", error);
    return c.json({ message: "Error fetching feednotifications configuration", error });
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
router.post("/", async (c) => {
  const body = await c.req.json();

  if (!body || typeof body !== "object") {
    return c.json({ message: "Invalid payload format" });
  }

  const entries = Object.entries(body) as [string, any][];

  if (entries.length === 0) {
    return c.json({ message: "No feeds provided" });
  }

  try {
    const results = [];

    for (const [key, value] of entries) {
      if (!key.startsWith("feed")) continue;

      const { guildId, rssChannelId, rssLink, rssPingRoleId } = value;

      if (!guildId) {
        return c.json({ message: "guildId is required" });
      }

      let config = await feednotifications.findOne({ where: { guildId } });

      if (config) {
        // Update existing
        config.set("rssChannelId", rssChannelId);
        config.set("rssLink", rssLink);
        config.set("rssPingRoleId", rssPingRoleId);
        await config.save();
      } else {
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

    return c.json({ config: results });
  } catch (error) {
    console.error("Error creating/updating feednotifications configuration:", error);
    return c.json({
      message: "Error creating/updating feednotifications configuration",
      error
    });
  }
});

/**
 * DELETE /dashboard/feednotifications?guildId=GUILD_ID
 * Delete a guild's feednotifications configuration.
 */
router.delete("/", async (c) => {
  const { guildId } = await c.req.json();
  if (!guildId) {
    return c.json({ message: "guildId is required" });
  }

  try {
    const deletedCount = await feednotifications.destroy({ where: { guildId } });
    if (!deletedCount) {
      return c.json({ message: "No configuration found for this guild to delete." });
    }
    return c.json({ message: "Configuration deleted successfully." });
  } catch (error) {
    console.error("Error deleting feednotifications configuration:", error);
    return c.json({ message: "Error deleting feednotifications configuration", error });
  }
});

export default router;
