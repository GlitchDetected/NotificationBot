// import { Client, Message, TextChannel, ChannelType } from "discord.js";
// import calculateLevelXp from "../../utils/calculateLevelXp";
// import Rank from "../../database/models/Rank";
// import rankconfigs from "../../database/models/rankconfigs";

// const cooldowns = new Set();

// function getRandomXp(min: number, max: number) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// /**
//  *
//  * @param {Client} client
//  * @param {Message} message
//  */
// export default async (client: Client, message: Message) => {
//   if (!message.inGuild() || message.author.bot || cooldowns.has(message.author.id)) return;

//   try {
//     // Fetch rank configuration for the guild
//     let rankConfig = await rankconfigs.findOne({ where: { guildId: message.guild.id } });

//     if (!rankConfig || !rankConfig.rankconfigure) {
//       return;
//     }

//     // Check if rank channel exists, if not, create it
//     let rankChannel = message.guild.channels.cache.get(rankConfig.rankchannel!) as TextChannel;

//     if (!rankChannel) {
//       console.log(`Rank channel not found for guild ${message.guild.id}. Creating a new one...`);

//       try {
//         // Create a new text channel named "levels"
//         rankChannel = await message.guild.channels.create({
//           name: "levels",
//           type: ChannelType.GuildText,
//         });

//         // Save the new rank channel ID to rankconfigs
//         rankConfig.rankchannel = rankChannel.id;
//         await rankConfig.save();

//         console.log(`Created new rank channel: ${rankChannel.id} and updated rankconfigs.`);
//       } catch (channelError) {
//         console.error(`Failed to create rank channel: ${channelError}`);
//         return;
//       }
//     }

//     const xpToGive = getRandomXp(5, 15);
//     const query = {
//       userId: message.author.id,
//       guildId: message.guild.id,
//     };

//     let level = await Rank.findOne({ where: query });

//     if (level) {
//       level.xp += xpToGive;

//       if (level.xp > calculateLevelXp(level.level)) {
//         level.xp = 0;
//         level.level += 1;

//         // Send level-up message in rank channel
//         rankChannel.send(`${message.member} has reached **level ${level.level}**! 🎉`);
//       }

//       await level.save().catch((e) => console.log(`Error saving updated level: ${e}`));

//     } else {
//       // Create a new level entry
//       level = await Rank.create({
//         userId: message.author.id,
//         guildId: message.guild.id,
//         xp: xpToGive,
//         level: 1, // Default to level 1 when creating a new entry
//       });
//     }

//     cooldowns.add(message.author.id);
//     setTimeout(() => cooldowns.delete(message.author.id), 60000);
//   } catch (error) {
//     console.error(`Error giving XP: ${error}`);
//   }
// };
