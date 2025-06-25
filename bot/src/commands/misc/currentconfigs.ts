import { Client, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export default {
  name: "currentconfigs",
  description: "Shows the current bot configurations for the server",
  callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
    try {
      // Ensure the interaction is a command and has a guild
      if (!interaction.isCommand() || !interaction.guild) {
        await interaction.reply({ content: "This command can only be used in a server.", ephemeral: true });
        return;
      }

      await interaction.deferReply();

      const guild = interaction.guild;

      // Fetch server details
      const serverName = guild.name;
      const serverID = guild.id;
      const owner = await guild.fetchOwner();
      const memberCount = guild.memberCount;
      const createdAt = guild.createdAt;
      const region = guild.preferredLocale;
      const iconURL = guild.iconURL({ size: 1024, forceStatic: true });
      const verificationLevel = guild.verificationLevel;

      // Create an embed
      const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle(`${serverName}`)
        .setThumbnail(iconURL)
        .addFields(
          { name: "Server Name", value: serverName, inline: true },
          { name: "Server ID", value: serverID, inline: true },
          { name: "Owner", value: owner.user.tag, inline: true },
          { name: "Member Count", value: memberCount.toString(), inline: true },
          { name: "Created At", value: createdAt.toLocaleDateString(), inline: true },
          { name: "Region", value: region, inline: true },
          { name: "Verification Level", value: verificationLevel.toString(), inline: true }
        );

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Error handling serverinfo command:", error);
      await interaction.editReply({ content: "An error occurred while fetching server information." });
    }
  }
};
