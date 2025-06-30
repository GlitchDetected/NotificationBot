import { Hono } from 'hono';
import db from "../../database/index";

const router = new Hono();

router.get("/", async (c) => {
  try {
    // Use a raw query to fetch commands since the model does not exist in the server
    const [commands] = await db.query('SELECT id, name, description FROM "Commands"');

    // If no commands are found, return a 404 error
    if (!commands || (commands as any[]).length === 0) {
      return c.json({ message: "No commands found in the database" });
    }

    // Send the commands back to the client
    return c.json({ commands });
  } catch (error: unknown) {
    // Error handling
    if (error instanceof Error) {
      console.error("Error fetching commands:", error.message);
      return c.json({ message: "Error fetching commands", error: error.message });
    } else {
      console.error("Unknown error occurred:", error);
      return c.json({ message: "Unknown error occurred", error: "An unknown error occurred" });
    }
  }
});

export default router;
