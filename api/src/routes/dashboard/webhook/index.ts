import express, { Request, Response, Router } from "express";
import { WebhookClient } from "discord.js";

const router: Router = express.Router();

router.post("/", async (req: Request, res: Response): Promise<any> => {
    try {
        const { webhookUrl, message, webhookavatar, username } = req.body;

        if (!webhookUrl || !message) {
            return res.status(400).json({ error: "webhookUrl and message are required." });
        }

        // Extract webhook ID and token from the URL
        const match = webhookUrl.match(/\/webhooks\/(\d+)\/([\w-]+)/);
        if (!match) {
            return res.status(400).json({ error: "Invalid webhook URL." });
        }
        const [, webhookId, webhookToken] = match;

        // Initialize Webhook Client
        const webhookClient = new WebhookClient({ id: webhookId, token: webhookToken });

        // Send message through Discord webhook
        const response = await webhookClient.send({
            content: message || "empty message! please input a message",
            username: username || "ChatGuard",
            avatarURL: webhookavatar || "https://chatguard.up.railway.app/images/chatguard.png",
        });

        res.json({
            success: true,
            message: "Message sent successfully.",
            response,
        });
    } catch (error: any) {
        console.error("Error sending webhook to Discord:", error.message);
        res.status(500).json({ error: "Failed to send webhook to Discord", details: error.message });
    }
});

export default router;
