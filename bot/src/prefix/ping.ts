import { Message, Client } from "discord.js";

export default {
  name: "ping",
  description: "Replies with Pong! Shows bot ping and websocket ping.",
  execute: async (message: Message, args: string[], client: Client) => {
    // Reply with "Pong!" and calculate the ping
    const sentMessage = await message.reply("Pong!");

    // Calculate the ping: message.createdTimestamp - the sent message timestamp
    const ping = sentMessage.createdTimestamp - message.createdTimestamp;

    // Get the websocket ping from the client
    const wsPing = client.ws.ping;

    // Send the calculated ping and websocket ping
    await sentMessage.edit({
      content: `Pong! Latency: ${ping}ms | WebSocket: ${wsPing}ms`,
    });
  },
};
