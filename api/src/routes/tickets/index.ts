import express, { Request, Response, Router } from "express";

const router: Router = express.Router();

router.get("/guilds", (req: Request, res: Response) => {
  console.log(req.user);
  res.send("received!");
});

// GET: api.notificationbot.com/tickets/guild/19873489234

router.get("/guild/:id", (req: Request, res: Response) => {
  const { id: guildId } = req.params;

  res.send(`Getting tickets for guild id ${guildId}`);
});

router.post("/", (req: Request, res: Response) => {
  res.send("POST: tickets route");
});

export default router;
