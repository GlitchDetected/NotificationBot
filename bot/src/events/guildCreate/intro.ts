import type { Client, Guild, TextChannel } from "discord.js";
import { ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder } from "discord.js";

import config from "@/src/config";

export default async (client: Client, guild: Guild) => {

    const commands = await client.application?.commands.fetch();
    if (!commands) return;

    const formattedCommands = Array.from(commands.values()).map((cmd) => `</${cmd.name}:${cmd.id}>`);
    const commandList = formattedCommands.join(" ");

    const channel = guild.systemChannel ?? guild.channels.cache.find(
        (ch): ch is TextChannel =>
            ch.type === 0 && ch.permissionsFor(guild.members.me!)?.has("SendMessages")
    );

    if (!channel) return;

    const embed = new EmbedBuilder()
        .setDescription(`
Thank you for adding NotificationBot!

### Here are some FAQs:
## How do I set up the bot?
You can setup everything on the **[Web Dashboard](${config.dashboard}/dashboard/${guild.id})**

## Does the bot have / commands?
Yes, just type slash (/) in the chat box to get started
> ${commandList}

-# New features are released from time to time, so look out!
    `)
        .setColor(0x2f3136);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setLabel("Join Support")
            .setEmoji("📞")
            .setStyle(ButtonStyle.Link)
            .setURL(config.supportServer),

        new ButtonBuilder()
            .setLabel("Dashboard")
            .setEmoji("📊")
            .setStyle(ButtonStyle.Link)
            .setURL(config.dashboard)
    );

    channel.send({ embeds: [embed], components: [row] });

};