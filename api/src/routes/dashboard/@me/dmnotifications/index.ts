import { Hono } from "hono";

import { HttpErrorMessage } from "@/constants/http-error";
import DmNotifications from "@/database/models/dmnotifications";
import { httpError } from "@/utils/httperrorHandler";
import type { ApiV1UsersMeGetResponse } from "~/typings";

const router = new Hono();

type UpdatableFields = "enabled" | "embedcolor" | "source" | "thumbnail" | "message";

router.get("/", async (c) => {
    try {
        const user = c.get("user");

        if (!user?.accessToken) {
            return httpError(HttpErrorMessage.MissingAccess);
        }

        const config = await DmNotifications.findOne({ where: { userId: user.id } });

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
    if (!user?.id) {
        return httpError(HttpErrorMessage.MissingAccess);
    }

    const body = await c.req.json() as ApiV1UsersMeGetResponse["dmnotifications"];

    try {
        let config = await DmNotifications.findOne({ where: { userId: user.id } });

        if (!body) {
            return httpError(HttpErrorMessage.BadRequest);
        }

        if (config) {
            const keys: ("enabled" | "embedcolor" | "source" | "thumbnail" | "message")[] =
      ["enabled", "embedcolor", "source", "thumbnail", "message"];

            for (const key of keys) {
                if (key in body) {
                    (config as Record<UpdatableFields, unknown>)[key] = body[key];
                }
            }
            await config.save();
        } else {
            // Create
            config = await DmNotifications.create({
                userId: user.id,
                enabled: body?.enabled,
                embedcolor: body?.embedcolor,
                source: body?.source,
                thumbnail: body?.thumbnail,
                message: body?.message
            });
        }

        return c.json({
            enabled: body?.enabled,
            embedcolor: config.embedcolor,
            source: config.source,
            thumbnail: config.thumbnail,
            message: config.message
        });
    } catch (error) {
        console.error("Error creating/updating user dmnotifications configuration:", error);
    }
});

router.delete("/", async (c) => {
    const user = c.get("user");

    if (!user?.accessToken) {
        return httpError(HttpErrorMessage.MissingAccess);
    }

    try {
        const deletedCount = await DmNotifications.destroy({ where: { userId: user.id } });
        if (!deletedCount) {
            return c.json({ message: "No configuration found to delete." });
        }
        return c.json({ message: "dmnotifications configuration deleted successfully." });
    } catch (error) {
        console.error("Error deleting dmnotifications configuration:", error);
    }
});

export default router;