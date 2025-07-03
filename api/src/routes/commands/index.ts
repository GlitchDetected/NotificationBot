import { Hono } from 'hono';

const router = new Hono();

router.get("/", async (c) => {
  try {
 const res = await fetch(`${process.env.DISCORD_ENDPOINT}/applications/${process.env.DISCORD_CLIENT_ID}/commands`, {
  headers: {
    Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
  },
});

const commands = await res.json();
const filtered = commands.map((cmd: any) => ({
  id: cmd.id,
  name: cmd.name,
  description: cmd.description,
}));

return c.json(filtered);

  } catch (err) {
    console.error("Error processing command data:", err);
  }
});

export default router;