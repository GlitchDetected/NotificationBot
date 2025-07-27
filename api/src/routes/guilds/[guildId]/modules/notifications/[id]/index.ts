import { Hono } from "hono";

import { deleteNotification, getNotificationById, upsertNotification } from "@/src/db/models/notifications";
import type { ApiV1GuildsModulesNotificationsGetResponse } from "@/typings";

const router = new Hono();

type UpdatableFields = "type" | "channelId" | "creatorId" | "roleId" | "regex";

router.get("/", async (c) => {
    const id = c.req.param("id");

    if (!id) {
        return c.json({ error: "Missing id parameter" }, 400);
    }

    try {
        const config = await getNotificationById(id);
        return c.json({
            id: config?.id ?? null,
            guildId: config?.guildId ?? null,
            channelId: config?.channelId ?? null,
            roleId: config?.roleId ?? null,
            type: config?.type ?? null,
            flags: config?.flags ?? null,
            regex: config?.regex ?? null,
            creatorId: config?.creatorId ?? null,
            message: {
                content: config?.message?.content ?? null,
                embed: config?.message?.embed ?? null
            },
            creator: {
                id: config?.creator?.id ?? null,
                username: config?.creator?.username ?? null,
                avatarUrl: config?.creator?.avatarUrl ?? null,
                customUrl: config?.creator?.customUrl ?? null
            }
        });
    } catch (error) {
        console.error("Error fetching notification configuration:", error);
    }
});

router.patch("/", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json() as ApiV1GuildsModulesNotificationsGetResponse;

    if (!id) {
        return c.json({ error: "Missing id parameter" }, 400);
    }

    try {
        const config = await getNotificationById(id);

        if (!config) {
            return c.json({ error: "Notification configuration not found" }, 404);
        }

        if (config) {
            const keys: ("type" | "channelId" | "creatorId" | "roleId" | "regex")[] =
      ["type", "channelId", "creatorId", "roleId", "regex"];

            for (const key of keys) {
                if (key in body) {
                    (config as Record<UpdatableFields, unknown>)[key] = body[key];
                }
            }

            if (typeof body.message === "object" && body.message !== null) {
                config.message = {
                    content:
      typeof body.message.content === "string"
          ? body.message.content
          : config.message?.content ?? null,
                    embed:
      typeof body.message.embed === "object" && body.message.embed !== null
          ? body.message.embed
          : config.message?.embed ?? undefined
                };
            }

            if (typeof body.creator === "object" && body.creator !== null) {
                config.creator = {
                    id:
      typeof body.creator.id === "string"
          ? body.creator.id
          : config.creator?.id ?? null,
                    username:
      typeof body.creator.username === "string"
          ? body.creator.username
          : config.creator?.username ?? null,
                    avatarUrl:
      typeof body.creator.avatarUrl === "string"
          ? body.creator.avatarUrl
          : config.creator?.avatarUrl ?? null,
                    customUrl:
      typeof body.creator.customUrl === "string"
          ? body.creator.customUrl
          : config.creator?.customUrl ?? null
                };
            }
        }

        const dataToSave = {
            ...config,
            createdAt: config.createdAt instanceof Date
                ? config.createdAt.toISOString()
                : config.createdAt,
            updatedAt: new Date().toISOString()
        };


        const updatedConfig = await upsertNotification(dataToSave);
        return c.json(updatedConfig);
    } catch (error) {
        console.error("Error creating/updating notification configuration:", error);
    }
});

router.delete("/", async (c) => {
    const id = c.req.param("id");

    if (!id) {
        return c.json({ error: "Missing id parameter" }, 400);
    }

    try {
        const deletedCount = await deleteNotification(id);
        if (!deletedCount) {
            return c.json({ message: "No configuration found for this guild to delete." });
        }
        return c.json({ message: "notification configuration deleted" });
    } catch (error) {
        console.error("Error deleting notification configuration:", error);
    }
});

export default router;