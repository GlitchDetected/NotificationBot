import express, { Router, Request, Response } from "express";

const router: Router = express.Router();

router.use(express.json());

// localhost:3001/status/
// api.notificationbot/status/

let latestStatus: any = null; // in memory storage

router.post("/", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    console.log("Received POST /status:"); //, data
  
    // save to resource / in memory
    latestStatus = data;

    res.status(200).json({ message: "Status data updated"}); //, data
  } catch (err) {
    console.error("Error processing status data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req: Request, res: Response): Promise<any> => {
  if (!latestStatus) {
    return res.status(404).json({ message: "No status data available" });
  }

  res.status(200).json(latestStatus);
});

export default router;
