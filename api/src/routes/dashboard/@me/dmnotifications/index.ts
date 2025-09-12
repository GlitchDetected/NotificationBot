import { Hono } from "hono";

import { HttpErrorMessage } from "@/src/constants/http-error";
import { createDmNotification, deleteDmNotification, getDmNotification, updateDmNotification } from "@/src/db/models/dmnotifications";
import { httpError } from "@/src/utils/httperrorHandler";
import type { ApiV1UsersMeGetResponse } from "@/typings";

const router = new Hono();

type UpdatableFields = "enabled" | "embedcolor" | "source" | "thumbnail" | "message";

router.get("/", async (c) => {
    try {
        const user = c.get("user");

        if (!user?.access_token) {
            return httpError(HttpErrorMessage.MissingAccess);
        }

        const config = await getDmNotification(user.id);

        return c.json({
            enabled: config?.enabled ?? false,
            embedcolor: config?.embedcolor ?? 0,
            source: config?.source ?? null,
            thumbnail: config?.thumbnail ?? null,
            message: config?.message ??	"You got a new notifications from"
        });
    } catch (error) {
        console.error("Error fetching user dmnotifications configuration:", error);
    }
});

router.patch("/", async (c) => {
    const user = c.get("user");

    if (!user?.access_token) {
        return httpError(HttpErrorMessage.MissingAccess);
    }

    const body = await c.req.json() as ApiV1UsersMeGetResponse["dmnotifications"];

    try {
        let config = await getDmNotification(user.id);

        if (!body) {
            return httpError(HttpErrorMessage.BadRequest);
        }

        if (config) {
            const keys: ("enabled" | "embedcolor" | "source" | "thumbnail" | "message")[] =
      ["enabled", "embedcolor", "source", "thumbnail", "message"];

            const updateData: Partial<typeof body> = {};

            for (const key of keys) {
                if (key in body) {
                    (updateData as Record<UpdatableFields, unknown>)[key] = body[key];
                }
            }
            await updateDmNotification(user.id, updateData);
        } else {
            // Create
            config = await createDmNotification({
                user_id: user.id,
                enabled: body?.enabled ?? false,
                embedcolor: body?.embedcolor ?? 0,
                source: body?.source ?? null,
                thumbnail: body?.thumbnail ?? null,
                message: body?.message ?? "You got a new notification from"
            });
        }

        return c.json({
            enabled: body?.enabled,
            embedcolor: config?.embedcolor,
            source: config?.source,
            thumbnail: config?.thumbnail,
            message: config?.message
        });
    } catch (error) {
        console.error("Error creating/updating user dmnotifications configuration:", error);
    }
});

router.delete("/", async (c) => {
    const user = c.get("user");

    if (!user?.access_token) {
        return httpError(HttpErrorMessage.MissingAccess);
    }

    try {
        const deletedCount = await deleteDmNotification(user.id);
        if (!deletedCount) {
            return c.json({ message: "No configuration found to delete." });
        }
        return c.json({ message: "dmnotifications configuration deleted successfully." });
    } catch (error) {
        console.error("Error deleting dmnotifications configuration:", error);
    }
});

export default router;