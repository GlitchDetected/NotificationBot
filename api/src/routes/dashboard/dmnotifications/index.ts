import express, { Request, Response, Router } from "express";
import { DataTypes, Model } from "sequelize";
import dmnotifications from "../../../database/models/dmnotifications";

const router: Router = express.Router();
router.use(express.json());

function getQueryParam(param: unknown): string | undefined {
  if (typeof param === "string") return param;
  if (Array.isArray(param) && param.length > 0) return param[0] as string;
  return undefined;
}

/**
 * GET /dashboard/dmnotifications?userId=USER_ID
 * Fetch the user dmnotifications configuration for a specific user.
 */
router.get("/", async (req: Request, res: Response): Promise<any> => {
  const userId = getQueryParam(req.query.userId);

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const config = await dmnotifications.findOne({ where: { userId } });
    if (!config) {
      return res.status(404).json({ message: "No user dmnotifications configuration found." });
    }

    return res.status(200).json({
      embedcolor: config.embedcolor,
      source: config.source
    });
  } catch (error) {
    console.error("Error fetching user dmnotifications configuration:", error);
    return res.status(500).json({ message: "Error fetching user dmnotifications configuration", error });
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
router.post("/", async (req: Request, res: Response): Promise<any> => {
  const { userId, embedcolor, source } = req.body;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ message: "userId is required and must be a string" });
  }

  try {
    let config = await dmnotifications.findOne({ where: { userId } });

    if (config) {
      // Update
      if (embedcolor) config.embedcolor = embedcolor;
      if (source) config.source = source;
      await config.save();
    } else {
      // Create
      config = await dmnotifications.create({
        userId,
        embedcolor: embedcolor || "#FF0000",
        source: source
      });
    }

    return res.status(200).json({
      embedcolor: config.embedcolor,
      source: config.source
    });
  } catch (error) {
    console.error("Error creating/updating user dmnotifications configuration:", error);
    return res.status(500).json({ message: "Error creating/updating dmnotifications configuration", error });
  }
});

/**
 * DELETE /dashboard/dmnotifications?userId=USER_ID
 * Delete a user's dmnotifications configuration.
 */
router.delete("/", async (req: Request, res: Response): Promise<any> => {
  const userId = getQueryParam(req.query.userId);

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const deletedCount = await dmnotifications.destroy({ where: { userId } });
    if (!deletedCount) {
      return res.status(404).json({ message: "No configuration found to delete." });
    }
    return res.status(200).json({ message: "dmnotifications configuration deleted successfully." });
  } catch (error) {
    console.error("Error deleting dmnotifications configuration:", error);
    return res.status(500).json({ message: "Error deleting dmnotifications configuration", error });
  }
});

export default router;
