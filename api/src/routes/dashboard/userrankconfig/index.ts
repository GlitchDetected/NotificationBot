import express, { Request, Response, Router } from "express";
import { DataTypes, Model } from "sequelize";
import db from "../../../database/index"; // Adjust the path as needed

const router: Router = express.Router();
router.use(express.json());

// Define an interface for your attributes.
interface IUserRankConfig {
  userId: string;
  bgColor: string;
  barColor: string;
}

// Extend the Sequelize Model interface with your attributes.
interface IUserRankConfigInstance extends Model<IUserRankConfig>, IUserRankConfig {}

// Define the UserRankConfig model with the correct type.
const UserRankConfig = db.define<IUserRankConfigInstance>(
  "Rank",
  {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    bgColor: {
      type: DataTypes.STRING,
      defaultValue: "#000000"
    },
    barColor: {
      type: DataTypes.STRING,
      defaultValue: "#FFFFFF"
    }
  },
  {
    tableName: "Rank",
    timestamps: true
  }
);

// Helper function to extract string from req.query parameters.
function getQueryParam(param: unknown): string | undefined {
  if (typeof param === "string") return param;
  if (Array.isArray(param) && param.length > 0) return param[0] as string;
  return undefined;
}

/**
 * GET /dashboard/userrankconfig?userId=USER_ID
 * Fetch the user rank configuration (bgColor and barColor) for a specific user.
 */
router.get("/", async (req: Request, res: Response): Promise<any> => {
  const userId = getQueryParam(req.query.userId);

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const config = await UserRankConfig.findOne({ where: { userId } });
    if (!config) {
      return res.status(404).json({ message: "No user rank configuration found." });
    }

    return res.status(200).json({
      bgColor: config.bgColor,
      barColor: config.barColor
    });
  } catch (error) {
    console.error("Error fetching user rank configuration:", error);
    return res.status(500).json({ message: "Error fetching user rank configuration", error });
  }
});

/**
 * POST /dashboard/userrankconfig
 * Create or update a user's rank configuration (background and bar color).
 *
 * Expected JSON payload:
 * {
 *   userId: string,
 *   bgColor?: string, // Optional (defaults to "#000000")
 *   barColor?: string // Optional (defaults to "#FFFFFF")
 * }
 */
router.post("/", async (req: Request, res: Response): Promise<any> => {
  const { userId, bgColor, barColor } = req.body;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ message: "userId is required and must be a string" });
  }

  try {
    let config = await UserRankConfig.findOne({ where: { userId } });

    if (config) {
      // Update the existing configuration.
      if (bgColor) config.bgColor = bgColor;
      if (barColor) config.barColor = barColor;
      await config.save();
    } else {
      // Create a new user rank configuration.
      config = await UserRankConfig.create({
        userId,
        bgColor: bgColor || "#000000",
        barColor: barColor || "#FFFFFF"
      });
    }

    return res.status(200).json({
      bgColor: config.bgColor,
      barColor: config.barColor
    });
  } catch (error) {
    console.error("Error creating/updating user rank configuration:", error);
    return res.status(500).json({ message: "Error creating/updating user rank configuration", error });
  }
});

/**
 * DELETE /dashboard/userrankconfig?userId=USER_ID
 * Delete a user's rank configuration.
 */
router.delete("/", async (req: Request, res: Response): Promise<any> => {
  const userId = getQueryParam(req.query.userId);

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const deletedCount = await UserRankConfig.destroy({ where: { userId } });
    if (!deletedCount) {
      return res.status(404).json({ message: "No configuration found to delete." });
    }
    return res.status(200).json({ message: "User rank configuration deleted successfully." });
  } catch (error) {
    console.error("Error deleting user rank configuration:", error);
    return res.status(500).json({ message: "Error deleting user rank configuration", error });
  }
});

export default router;
