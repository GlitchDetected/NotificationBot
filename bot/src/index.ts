import { Client, IntentsBitField, Collection } from "discord.js";
import eventHandler from "./handlers/eventHandler";
import db from "./database/index";
import models from "./database/models";

import dotenv from "dotenv";
dotenv.config();

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

    Object.keys(models).forEach((ele) => {
      const model = (models as any)[ele];
      if (model.associate) {
        model.associate(models);
      }
      console.log(`Connected to model: ${model.name}`);
    });

    await db.sync({
      // force: forceDbReset, if true
      force: false
    });

    console.log(`Completed database connection`);

    eventHandler(client);

    client.login(process.env.TOKEN);
    
  } catch (error) {
    console.log(`Error: ${error}`);
  }

})();