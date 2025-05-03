import express, { Request, Response, Router } from "express";
import { DataTypes } from "sequelize";
import db from "../../../database/index";

const router: Router = express.Router();

// Define the AFK model dynamically using sequelize.define
const Afk = db.define(
  "afk",
  {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,  // Ensure that each user can only have one AFK record at a time
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "afk",
    timestamps: true,  // Sequelize will manage createdAt and updatedAt fields automatically
  }
);

function getQueryParam(param: unknown): string | undefined {
    if (typeof param === "string") return param;
    if (Array.isArray(param) && param.length > 0) return param[0] as string;
    return undefined;
  }

// GET /dashboard/afk?userId=someUserId
router.get("/", async (req: Request, res: Response): Promise<any> => {
    if (!req.user) {
      return res.status(401).json({ message: "Not logged in" });
    }
  
    const userId = getQueryParam(req.query.userId);
  
    if (!userId) {
      return res.status(400).json({ message: "userId query parameter is required" });
    }
  
    try {
      // Fetch the AFK data based on the userId
      const afkData = await Afk.findOne({
        where: { userId },
      });
  
      if (!afkData) {
        return res.status(404).json({ message: "No AFK data found for this user. use /afk to set an afk first!" });
      }
  
      // Return the AFK data
      res.status(200).json({ afkData });
    } catch (error) {
      console.error("Error fetching AFK data:", error);
      res.status(500).json({ message: "Error fetching AFK data", error });
    }
  });
  
  export default router;