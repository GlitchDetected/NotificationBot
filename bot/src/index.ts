import "@dotenvx/dotenvx/config";

import { Client, IntentsBitField } from "discord.js";

import db from "./database/index";
import models, { type ModelsMap } from "./database/models";
import eventHandler from "./handlers/eventHandler";

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.MessageContent
    ]
});

// const forceDbReset = process.env.FORCE_DB_RESET === 'false';

(async () => {
    try {
        console.clear();

        Object.entries(models).forEach(([_, model]) => {
            if ("associate" in model && typeof model.associate === "function") {
                (model.associate as (models: ModelsMap) => void)(models);
            }

            console.log(`Registered: ${model.name}`);
        });

        await db.sync({
            // force: forceDbReset,
            force: false
        });

        console.log("Connected to PG DB");

        eventHandler(client);

        client.login(process.env.DISCORD_TOKEN);

    } catch (error) {
        console.log(`Error: ${error}`);
    }

})();