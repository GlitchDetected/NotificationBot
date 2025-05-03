import { Client, CommandInteraction } from "discord.js";

export default {
  name: "ping",
  description: "Replies with the bot ping",
  // deleted: 'true',

  callback: async (client: Client, interaction: CommandInteraction) => {
    await interaction.deferReply();

    const reply = await interaction.fetchReply();

    const ping = reply.createdTimestamp - interaction.createdTimestamp;

    interaction.editReply(`Pong! Client ${ping}ms | Websocket: ${client.ws.ping}ms`);
  }
};
