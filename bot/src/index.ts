import { Client, IntentsBitField } from "discord.js";

import eventHandler from "@/src/handlers/eventHandler";

import config from "./config";

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.MessageContent
    ]
});

(() => {
    try {
        eventHandler(client);

        client.login(config.client.token);

    } catch (error) {
        console.log(`Error: ${error}`);
    }

})();