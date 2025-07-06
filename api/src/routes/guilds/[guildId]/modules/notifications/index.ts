import { Hono } from 'hono';
import Notifications from "@/database/models/notifications";
import { httpError } from '@/utils/httperror';
import { HttpErrorMessage } from '@/utils/httpjson';
const router = new Hono();

import notificationIdRouter from "./[id]";
router.route("/:id", notificationIdRouter); // dynamic route


router.get("/", async (c) => {
  const guildId = c.req.param('guildId')

  try {
    const configs = await Notifications.findAll({ where: { guildId } });

    const indexedConfigs = configs.reduce((acc, config, index) => {
      acc[index] = config;
      return acc;
    }, {} as Record<number, typeof configs[0]>);

    return c.json(indexedConfigs);

  } catch (error) {
    console.error("Error fetching notification configuration:", error);
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

      const creator = config.creator || {};

      if ("creatorId" in body) creator.id = body.creatorId;
      if ("creatorHandle" in body) creator.username = body.creatorHandle;
      creator.customUrl = body.customUrl ?? null;
      creator.avatarUrl = body.avatarUrl ?? null;

      config.creator = creator;

      await config.save();
    } else {
      const creator = {
        id: body.creatorId,
        username: body.creatorHandle,
        customUrl: body.customUrl ?? null,
        avatarUrl: body.avatarUrl ?? null,
      };

      config = await Notifications.create({
        // id:
        guildId: guildId,
        channelId: body.channelId,
        // roleId:
        type: body.type,
        creatorId: body.creatorId,
        // createdAt:
        // flags:
        // regex:
        creator
      });
    }

    return c.json({ config: config });
  } catch (error) {
    console.error("Error creating/updating notification configuration:", error);
  }
});

export default router;
