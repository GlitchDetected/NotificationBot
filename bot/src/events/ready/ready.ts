import { Client, Message } from "discord.js";
import { save } from "../../utils/saveCommands";
import prefixHandler from "../../handlers/prefixHandler";

export default (client: Client) => {

  interface Activity {
    name: string;
    type: number;
  }

  const activities: Activity[] = [
    { name: `/help`, type: 4 },
    { name: `https://discord.gg/QnZcYsf2E9 | /help`, type: 4 },
    // { name: `${client.guilds.cache.size} servers | /help`, type: 4 },
  ];

  if (client.user) {
    console.log(`${client.user.tag} is online`);
    save(client);
    prefixHandler(client);

    let currentIndex = 0;

    const updateActivity = () => {
      const activity = activities[currentIndex];

      console.log(`Status: ${activity.name}`);

      client.user!.setPresence({
        status: "dnd",
        activities: [activity],
      });

      currentIndex = (currentIndex + 1) % activities.length;
    };

    updateActivity();

    // 24h = 86400000ms
    // 1s = 1000ms
    setInterval(updateActivity, 86400000);
  }
  client.on("messageCreate", async (message: Message) => {
    if (message.author.bot) return;

    if (message.mentions.has(client!.user!)) {
      message.reply(`Oh hey ${message.author.username}! use /help to get help!`);
    }
  });
};