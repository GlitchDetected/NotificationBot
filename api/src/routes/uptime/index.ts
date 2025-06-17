import express, { Router, Request, Response } from "express";
import { Pool } from "pg";

const router: Router = express.Router();

const pool = new Pool({
  connectionString: process.env.pgConnectionString
});
console.log("Connected to Postgresql db");

// localhost:3001/uptime/
// api.notificationbot/uptime/

router.get("/", (req: Request, res: Response) => {
  pool.query(`SELECT "Uptime" FROM "Uptime" WHERE id = $1`, [1], (err, result) => {
    if (err) {
      console.error("Error fetching uptime:", err);
      return res.status(500).send("An error occurred while fetching the uptime.");
    }

    if (result.rows.length === 0) {
      return res.status(404).send("Uptime table not found.");
    }

    const uptime = result.rows[0].Uptime;

    const hours = Math.floor(uptime / (1000 * 60 * 60));
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((uptime % (1000 * 60)) / 1000);
    res.json({
      uptime: {
        hours,
        minutes,
        seconds
      }
    });
  });
});

export default router;
