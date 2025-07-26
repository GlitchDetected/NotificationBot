import { Client, IntentsBitField } from "discord.js";

import db from "@/src/database/index";
import models, { type ModelsMap } from "@/src/database/models";
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

        client.login(config.client.token);

    } catch (error) {
        console.log(`Error: ${error}`);
    }

})();