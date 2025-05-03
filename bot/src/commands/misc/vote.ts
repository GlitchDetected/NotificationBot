import {
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
  } from "discord.js";
  
  export default {
    name: "vote",
    description: "Vote for NotificationBot",
    callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
      await interaction.deferReply();
  
        const embed = new EmbedBuilder()
          .setColor(0x4285f4)
          .setTitle("🗳️ Vote for NotificationBot!")
          .setDescription(`Please vote for NotificationBot on top.gg - [Vote Now](https://top.gg/bot/1237878380838523001#vote)`)
        
        const row = new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setLabel('Vote Now')
              .setStyle(ButtonStyle.Link)
              .setURL('https://top.gg/bot/1237878380838523001#vote')
          );
  
        await interaction.editReply({ 
          embeds: [embed],
          components: [row]
        });
      }
  };