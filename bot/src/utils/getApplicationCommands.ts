export default async (
  client: { guilds: { fetch: (arg0: any) => any }; application: { commands: any } | null },
  guildId: any
) => {
  let applicationCommands;

  if (guildId) {
    const guild = await client.guilds.fetch(guildId);
    applicationCommands = guild.commands;
  } else {
    if (client.application) {
      applicationCommands = await client.application.commands;
    } else {
      throw new Error("Client application is not available.");
    }
  }

  await applicationCommands.fetch();
  return applicationCommands;
};
