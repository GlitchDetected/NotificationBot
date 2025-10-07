import type { Client, Message } from "discord.js";

import { fetchNotifications } from "@/src/lib/notification";
import saveShards from "@/src/lib/saveShards";
export default async (client: Client) => {

    interface Activity {
        name: string;
        type: number;
    }

    const activities: Activity[] = [
        { name: "/help", type: 4 },
        { name: "https://discord.gg/QnZcYsf2E9 | /help", type: 4 }
    ];

    if (client.user) {
        console.log(`${client.user.tag} is online`);
        await saveShards(client);

        let currentIndex = 0;

        const updateActivity = () => {
            const activity = activities[currentIndex];

            console.log(`Status: ${activity.name}`);

            client.user!.setPresence({
                status: "dnd",
                activities: [activity]
            });

            currentIndex = (currentIndex + 1) % activities.length;
        };

        updateActivity();
        setInterval(updateActivity, 86400000); // ms

        fetchNotifications(client);
        setInterval(fetchNotifications, 5 * 60 * 1000);

        client.on("messageCreate", (message: Message) => {
            if (message.author.bot) return;

            if (message.mentions.has(client!.user!)) {
                message.reply(`Oh hey ${message.author.username}! use /help to get help!`);
            }
        });
    }
};