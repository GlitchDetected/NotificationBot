// where the commands are born

import path from "path";

import getAllFiles from "./getAllFiles";

export default async (exceptions: string[] = []) => {
    const localCommands = [];

    const commandCategories = getAllFiles(path.join(__dirname, "..", "commands"), true);

    for (const commandCategory of commandCategories) {
        const commandFiles = getAllFiles(commandCategory);

        for (const commandFile of commandFiles) {
            const commandObject = (await import(commandFile)).default;

            if (exceptions.includes(commandObject.name)) {
                continue;
            }

            localCommands.push(commandObject);
        }
    }

    return localCommands;
};