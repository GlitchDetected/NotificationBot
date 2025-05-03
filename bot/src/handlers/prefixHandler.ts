import { Client, Message, Collection } from "discord.js";
import fs from "fs";
import path from "path";
import Prefix from "../database/models/Prefix";

const commands = new Collection<string, any>();

// Load all prefix commands dynamically
const commandFiles = fs.readdirSync(path.join(__dirname, "../prefix")).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

for (const file of commandFiles) {
  import(`../prefix/${file}`).then(commandModule => {
    const command = commandModule.default;
    if (command?.name) {
      commands.set(command.name, command);
    }
  }).catch(err => {
    console.error(`Error loading command ${file}:`, err);
  });
}

export default async function prefixHandler(client: Client) {
  client.on("messageCreate", async (message: Message) => {
    if (message.author.bot || !message.guild) return;

    // Fetch prefix from the database
    let guildPrefix = "`"; // Default prefix
    const prefixEntry = await Prefix.findOne({ where: { guildId: message.guild.id } });
    if (prefixEntry) guildPrefix = prefixEntry.prefix;

    // Check if message starts with the prefix
    if (!message.content.startsWith(guildPrefix)) return;

    // Extract command and arguments
    const args = message.content.slice(guildPrefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    // Find and execute the command
    const command = commands.get(commandName);
    if (command) {
      try {
        await command.execute(message, args, client);
      } catch (error) {
        console.error(error);
        await message.reply("There was an error executing that command.");
      }
    }
  });
}
