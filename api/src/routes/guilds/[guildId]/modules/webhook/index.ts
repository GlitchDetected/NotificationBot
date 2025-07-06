import { Hono } from 'hono';
import { WebhookClient } from "discord.js";

const router = new Hono();

router.post("/", async (c) => {
  try {
    const { webhookUrl, message, webhookavatar, username } = await c.req.json();

    if (!webhookUrl || !message) {
      return c.json({ error: "webhookUrl and message are required." });
    }

    // Extract webhook ID and token from the URL
    const match = webhookUrl.match(/\/webhooks\/(\d+)\/([\w-]+)/);
    if (!match) {
      return c.json({ error: "Invalid webhook URL." });
    }
    const [, webhookId, webhookToken] = match;

    // Initialize Webhook Client
    const webhookClient = new WebhookClient({ id: webhookId, token: webhookToken });

    // Send message through Discord webhook
    const response = await webhookClient.send({
      content: message || "empty message! please input a message",
      username: username || "NotificationBot",
      avatarURL: webhookavatar || "https://notificationbot.up.railway.app/images/notificationbot.png"
    });

    return c.json({
      success: true,
      message: "Message sent successfully.",
      response
    });
  } catch (error: any) {
    console.error("Error sending webhook to Discord:", error.message);
    return c.json({ error: "Failed to send webhook to Discord", details: error.message });
  }
});

export default router;