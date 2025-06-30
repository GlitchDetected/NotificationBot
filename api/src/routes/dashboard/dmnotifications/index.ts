import { Hono } from 'hono';
import { DataTypes, Model } from "sequelize";
import dmnotifications from "../../../database/models/dmnotifications";

const router = new Hono();

/**
 * GET /dashboard/dmnotifications?userId=USER_ID
 * Fetch the user dmnotifications configuration for a specific user.
 */
router.get("/", async (c) => {
  const userId = c.req.query('userId');

  if (!userId) {
    return c.json({ message: "userId is required" });
  }

  try {
    const config = await dmnotifications.findOne({ where: { userId } });
    if (!config) {
       return c.json({ message: "No user dmnotifications configuration found." });
    }

     return c.json({
      embedcolor: config.embedcolor,
      source: config.source,
      message: config.message
    });
  } catch (error) {
    console.error("Error fetching user dmnotifications configuration:", error);
     return c.json({ message: "Error fetching user dmnotifications configuration", error });
  }
});

/**
 * POST /dashboard/dmnotifications
 * Create or update a user's dmnotifications configuration
 *
 * Expected JSON payload:
 * {
 *   userId: string,
 *   bgColor?: string, // Optional (defaults to "#000000")
 *   barColor?: string // Optional (defaults to "#FFFFFF")
 * }
 */
router.post("/", async (c) => {
  const { userId, embedcolor, source, message } = await c.req.json();

  if (!userId || typeof userId !== "string") {
     return c.json({ message: "userId is required and must be a string" });
  }

  try {
    let config = await dmnotifications.findOne({ where: { userId } });

    if (config) {
      // Update
      if (embedcolor) config.embedcolor = embedcolor;
      if (source) config.source = source;
      if (message) config.message = message;
      await config.save();
    } else {
      // Create
      config = await dmnotifications.create({
        userId,
        embedcolor: embedcolor || "#FF0000",
        source: source,
        message: message || "You got a new notifications from"
      });
    }

     return c.json({
      embedcolor: config.embedcolor,
      source: config.source,
      message: config.message
    });
  } catch (error) {
    console.error("Error creating/updating user dmnotifications configuration:", error);
     return c.json({ message: "Error creating/updating dmnotifications configuration", error });
  }
});

/**
 * DELETE /dashboard/dmnotifications?userId=USER_ID
 * Delete a user's dmnotifications configuration.
 */
router.delete("/", async (c) => {
  const userId = c.req.query('userId');

  if (!userId) {
     return c.json({ message: "userId is required" });
  }

  try {
    const deletedCount = await dmnotifications.destroy({ where: { userId } });
    if (!deletedCount) {
       return c.json({ message: "No configuration found to delete." });
    }
     return c.json({ message: "dmnotifications configuration deleted successfully." });
  } catch (error) {
    console.error("Error deleting dmnotifications configuration:", error);
     return c.json({ message: "Error deleting dmnotifications configuration", error });
  }
});

export default router;
