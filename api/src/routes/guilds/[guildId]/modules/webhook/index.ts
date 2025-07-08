import { type APIEmbed, WebhookClient } from "discord.js";
import { Hono } from "hono";

import type { ApiV1GuildsModulesWebhookGetResponse } from "~/typings";

const router = new Hono();

router.post("/", async (c) => {
    try {
        const body = await c.req.json() as ApiV1GuildsModulesWebhookGetResponse;
        console.log(body);

        if (!body.webhookUrl) {
            return c.json({ error: "webhookUrl required" });
        }

        const match = body.webhookUrl.match(/\/webhooks\/(\d+)\/([\w-]+)/);
        if (!match) {
            return c.json({ error: "Invalid webhook URL" });
        }
        const [, webhookId, webhookToken] = match;

        const webhookClient = new WebhookClient({ id: webhookId, token: webhookToken });

        const embed: APIEmbed | undefined = body.embed
            ? {
                title: body.embed.title ?? undefined,
                description: body.embed.description ?? undefined,
                color: body.embed.color,
                thumbnail: body.embed.thumbnail ? { url: body.embed.thumbnail } : undefined,
                image: body.embed.image ? { url: body.embed.image } : undefined,
                footer: body.embed.footer?.text
                    ? {
                        text: body.embed.footer.text,
                        icon_url: body.embed.footer.icon_url ?? undefined
                    }
                    : undefined
            }
            : undefined;

        const res = await webhookClient.send({
            content: body.content || "",
            embeds: embed ? [embed] : undefined,
            username: body.username || "NotificationBot",
            avatarURL: body.webhookAvatar || ""
        });

        return c.json(res);
    } catch (error) {
        console.error("Error sending webhook to Discord:", error);
    }
});

export default router;