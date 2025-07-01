/**
* /guilds/${params.guildId}
* /channels
* /roles
* /emojis
/** */

import { Hono } from 'hono'
import { httpError } from '../../../utils/httperror';
import { HttpErrorMessage } from '../../../utils/httpjson';
import Prefix from '../../../database/models/Prefix';
import redis from '../../../lib/redis';

const router = new Hono()
const DISCORD_ENDPOINT = "https://discord.com/api/v10";

router.get('/', async (c) => {
  const guildId = c.req.param('guildId')

    const user = c.get('user');

    if (!user?.accessToken) {
       return httpError(HttpErrorMessage.MissingAccess)
    }

      const guildRes = await fetch(`${DISCORD_ENDPOINT}/guilds/${guildId}`, {
    headers: {
      Authorization: `Bot ${process.env.BOT_TOKEN}`,
    },
  });

    if (!guildRes.ok) {
    return httpError(HttpErrorMessage.guildFetchError);
  }

  const guild = await guildRes.json();

    let botPrefix = ";";
    const prefixEntry = await Prefix.findOne({ where: { guildId: guild.id } });
    if (prefixEntry) botPrefix = prefixEntry.getDataValue("prefix");

  return c.json({
    id: guild.id,
    name: guild.name,
    icon: guild.icon,
    banner: guild.banner ?? null,
    memberCount: guild.approximate_member_count || guild.member_count || 0,
    inviteUrl: `https://discord.com/channels/${guild.id}`,
    description: guild.description,
    botPrefix,
  });
});

router.get('/channels', async (c) => {
  const guildId = c.req.param('guildId')

    const user = c.get('user');

    if (!user?.accessToken) {
       return httpError(HttpErrorMessage.MissingAccess)
    }

            const channelsRes = await fetch(`${DISCORD_ENDPOINT}/guilds/${guildId}/channels`, {
          headers: {
            Authorization: `Bot ${process.env.BOT_TOKEN}`
          }
        });

          if (!channelsRes.ok) {
            return httpError(HttpErrorMessage.guildFetchError);
          }

          const channels = await channelsRes.json();

        return c.json(channels)
})

router.get('/roles', async (c) => {
  const guildId = c.req.param('guildId')

    const user = c.get('user');

    if (!user?.accessToken) {
       return httpError(HttpErrorMessage.MissingAccess)
    }

          const rolesRes = await fetch(`${DISCORD_ENDPOINT}/guilds/${guildId}/roles`, {
          headers: {
            Authorization: `Bot ${process.env.BOT_TOKEN}`
          }
        });

         if (!rolesRes.ok) {
            return httpError(HttpErrorMessage.guildFetchError);
          }

        const roles = await rolesRes.json();

        return c.json(roles)
})

router.get('/emojis', async (c) => {
  const guildId = c.req.param('guildId')

    const user = c.get('user');

    if (!user?.accessToken) {
       return httpError(HttpErrorMessage.MissingAccess)
    }

          const emojisRes = await fetch(`${DISCORD_ENDPOINT}/guilds/${guildId}/emojis`, {
          headers: {
            Authorization: `Bot ${process.env.BOT_TOKEN}`
          }
        });

                 if (!emojisRes.ok) {
            return httpError(HttpErrorMessage.guildFetchError);
          }

        const emojis = await emojisRes.json();
        
      return c.json(emojis)
})


router.patch("/", async (c) => {
  const guildId = c.req.param('guildId')
  const user = (c.req as any).user;
  if (!user?.accessToken) {
    return c.json({ message: "Not logged in" });
  }

  const body = await c.req.json();

  try {
    let config = await Prefix.findOne({ where: { guildId } });

        if (config) {
      const keys: Array<"prefix"> = 
      ["prefix"];
      
      for (const key of keys) {
        if (key in body) {
          (config as any)[key] = body[key];
        }
      }
      await config.save();
    } else {
      // Create
      config = await Prefix.create({
        guildId: guildId,
        prefix: body.prefix,
      });
    }

    const cachedGuilds = await redis.get(`user-guilds:${user.id}`);
    if (cachedGuilds) {
      const guilds = JSON.parse(cachedGuilds);
      const updatedGuilds = guilds.map((g: any) => (g.id === guildId ? { ...g, botPrefix: body.prefix } : g));
      await redis.set(`user-guilds:${user.id}`, JSON.stringify(updatedGuilds), "EX", 600);
    }

  } catch (error) {
    console.error("Error updating prefix:", error);
    return c.json({ message: "Internal server error" });
  }
});


export default router;