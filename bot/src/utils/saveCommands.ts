import { Client } from 'discord.js';
import Command from '../database/models/Commands'; 

async function check(commands: any[]) {
  try {
    for (const command of commands) {
      await Command.upsert({
        id: command.id,
        name: command.name,
        description: command.description,
      });
    }
    console.log("Commands saved to database successfully.");
  } catch (error) {
    console.error("Error saving commands to database:", error);
  }
}

export async function save(client: Client) {
  try {
    if (!client.application) {
      console.error("Bot is not logged in or application object is not available.");
      return;
    }

    const commands = await client.application!.commands.fetch();

    const commandEntries = Array.from(commands.values()).map((command) => ({
      name: command.name,
      description: command.description,
      id: command.id,
    }));

    await check(commandEntries);
  } catch (error) {
    console.error("Error fetching commands:", error);
  }
}
