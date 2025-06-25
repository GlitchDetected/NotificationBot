import { Client, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Uptime from "../../database/models/Uptime";

export default {
  name: "uptime",
  description: "Replies with how long the bot has been online!",
  callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
    const uptime = client.uptime;

    if (uptime === null) {
      await interaction.reply("Sorry, I could not retrieve the uptime at the moment.");
      return;
    }

    await Uptime.upsert({ id: 1, uptime: uptime });

    const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
    const hours = Math.floor(uptime / (1000 * 60 * 60));
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((uptime % (1000 * 60)) / 1000);

    const embed = new EmbedBuilder()
      .setColor(0x8b4513)
      .setTitle(`Uptime`)
      .setDescription(`🕑 **${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds**`);

    await interaction.reply({ embeds: [embed] });
  }
};
