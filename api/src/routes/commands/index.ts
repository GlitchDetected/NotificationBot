import { Hono } from "hono";

const router = new Hono();

interface Command {
    id: string;
    name: string;
    description: string;
}

router.get("/", async (c) => {
    try {
        const res = await fetch(`${process.env.DISCORD_ENDPOINT}/applications/${process.env.DISCORD_CLIENT_ID}/commands`, {
            headers: {
                Authorization: `Bot ${process.env.DISCORD_TOKEN}`
            }
        });

        const commands = await res.json();
        const filtered = (commands as Command[]).map((cmd: Command) => ({
            id: cmd.id,
            name: cmd.name,
            description: cmd.description
        }));

        return c.json(filtered);

    } catch (error) {
        console.error("Error processing command data:", error);
    }
});

export default router;