import express, { Request, Response, Router } from "express";
import db from "../../database/index";

const router: Router = express.Router();

router.use(express.json());

router.get("/", async (req: Request, res: Response): Promise<any> => {
  try {
    // Use a raw query to fetch commands since the model does not exist in the server
    const [commands] = await db.query('SELECT id, name, description FROM "Commands"');

    // If no commands are found, return a 404 error
    if (!commands || (commands as any[]).length === 0) {
      return res.status(404).json({ message: "No commands found in the database" });
    }

    // Send the commands back to the client
    res.status(200).json({ commands });
  } catch (error: unknown) {
    // Error handling
    if (error instanceof Error) {
      console.error("Error fetching commands:", error.message);
      res.status(500).json({ message: "Error fetching commands", error: error.message });
    } else {
      console.error("Unknown error occurred:", error);
      res.status(500).json({ message: "Unknown error occurred", error: "An unknown error occurred" });
    }
  }
});

export default router;
