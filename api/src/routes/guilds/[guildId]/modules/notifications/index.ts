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

if (configs.length === 0) {
  return c.json({
    creator: { 
      id: null,
      username: null,
      avatarUrl: null,
      customUrl: null,
    }
  });
}

        return c.json(
      configs.map(config => ({
        id: config.id ?? null,
        guildId: config.guildId ?? null,
        channelId: config.channelId ?? null,
        roleId: config.roleId ?? null,
        type: config.type ?? null,
        flags: config.flags ?? null,
        regex: config.regex ?? null,
        creatorId: config.creatorId ?? null,
        message: { 
          content: config.message?.content ?? null,
          embed: config.message?.embed ?? null,
        },
        creator: { 
          id: config.creator?.id ?? null,
          username: config.creator?.username ?? null,
          avatarUrl: config.creator?.avatarUrl ?? null,
          customUrl: config.creator?.customUrl ?? null,
          },
        })));
} catch (error) {
    console.error("Error fetching notification configuration:", error);
  }
});

router.post("/", async (c) => {
  const guildId = c.req.param('guildId')
  const body = await c.req.json();

  console.log(body);

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
        id: crypto.randomUUID(),
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