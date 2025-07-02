import { Hono } from 'hono';
import Notifications from "@/database/models/notifications";
import { httpError } from '@/utils/httperror';
import { HttpErrorMessage } from '@/utils/httpjson';
const router = new Hono();

router.get("/", async (c) => {
  const guildId = c.req.param('guildId')

  try {
    const config = await Notifications.findOne({ where: { guildId } });
    if (!config) {
      return c.json({ message: "No configuration found for this guild." });
    }
    return c.json({ config });
  } catch (error) {
    console.error("Error fetching tpa configuration:", error);
    return c.json({ message: "Error fetching tpa configuration", error });
  }
});

router.post("/", async (c) => {
  const guildId = c.req.param('guildId')
  const body = await c.req.json();

  try {
    let config = await Notifications.findOne({ where: { guildId: guildId } });

        if (config) {
      const keys: Array<"type" | "channelId" | "creatorHandle" | "creatorId"> = 
      ["type", "channelId", "creatorHandle", "creatorId"];
      
      for (const key of keys) {
        if (key in body) {
          (config as any)[key] = body[key];
        }
      }
      await config.save();
    } else {
      config = await Notifications.create({
        guildId: guildId,
        type: body.type,
        channelId: body.channelId,
        creatorId: body.creatorId,
      });
    }

    return c.json({ config: config });
  } catch (error) {
    console.error("Error creating/updating rank configuration:", error);
  }
});

router.delete("/", async (c) => {
  const guildId = c.req.param('guildId')
  if (!guildId) {
    return c.json({ message: "guildId is required" });
  }

  const notificationId = c.req.param('id')

  try {
    const deletedCount = await Notifications.destroy({ where: { guildId } });
    if (!deletedCount) {
      return c.json({ message: "No configuration found for this guild to delete." });
    }
    return c.json({ message: "Configuration deleted successfully." });
  } catch (error) {
    console.error("Error deleting TPA configuration:", error);
    return c.json({ message: "Error deleting TPA configuration", error });
  }
});

export default router;
