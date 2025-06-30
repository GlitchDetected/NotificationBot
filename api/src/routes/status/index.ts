import { Hono } from 'hono';

const router = new Hono();

// localhost:3001/status/
// api.notificationbot/status/

let latestStatus: any = null; // in memory storage

router.post("/", async (c) => {
  try {
    const data = c.req.json;
    console.log("Received POST /status:"); //, data
  
    // save to resource / in memory
    latestStatus = data;

    return c.json({ message: "Status data updated" }, 200);
  } catch (err) {
    console.error("Error processing status data:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});

router.get("/", async (c) => {
  if (!latestStatus) {
    return c.json({ message: "No status data available" }, 404);
  }

  return c.json(latestStatus, 200);
});

export default router;
