/**
* /guilds/${params.guildId}
* /channels
* /roles
* /emojis
/** */
import { Hono } from 'hono'
import { httpError } from '@/utils/httperror';
import { HttpErrorMessage } from '@/utils/httpjson';
import Prefix from '@/database/models/Prefix';
import FollowUpdates from '@/database/models/followupdates';
import redis from '@/lib/redis';
const router = new Hono()
const DISCORD_ENDPOINT = process.env.DISCORD_ENDPOINT

import modulesRouter from "./modules";
router.route("/modules", modulesRouter);

router.get('/', async (c) => {
  const guildId = c.req.param('guildId')

    const user = c.get('user');

    if (!user?.accessToken) {
       return httpError(HttpErrorMessage.MissingAccess)
    }

      const guildRes = await fetch(`${DISCORD_ENDPOINT}/guilds/${guildId}`, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
    },
  });

    if (!guildRes.ok) {
    return httpError(HttpErrorMessage.guildFetchError);
  }

  const guild = await guildRes.json();

    const botPrefix = await Prefix.findOne({
  where: { guildId: guildId },
  attributes: ['prefix'],
});

    const followUpdates = await FollowUpdates.findOne({where: { guildId: guildId  }});

  return c.json({
    id: guild.id,
    name: guild.name,
    icon: guild.icon,
    banner: guild.banner ?? null,
    memberCount: guild.approximate_member_count,
    inviteUrl: `https://discord.com/channels/${guild.id}`,
    description: guild.description,
    ...followUpdates,
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
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`
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
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`
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
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`
          }
        });

                 if (!emojisRes.ok) {
            return httpError(HttpErrorMessage.guildFetchError);
          }

        const emojis = await emojisRes.json();
        
      return c.json(emojis)
})


router.patch("/prefix", async (c) => {
  const guildId = c.req.param('guildId')

  const user = c.get("user");

    if (!user?.accessToken) {
       return httpError(HttpErrorMessage.MissingAccess)
    }

  const body = await c.req.json();

  try {
    let config = await Prefix.findOne({ where: { guildId: guildId } });

        if (config) {
      const keys: Array<"botPrefix"> = 
      ["botPrefix"];
      
      for (const key of keys) {
        if (key in body) {
          (config as any)[key] = body[key];
        }
      }
      await config.save();
    } else {
      config = await Prefix.create({
        guildId: guildId,
        prefix: body.botPrefix,
      });
    }

    const cachedGuilds = await redis.get(`user-guilds:${user.id}`);
    if (cachedGuilds) {
      const guilds = JSON.parse(cachedGuilds);
      const updatedGuilds = guilds.map((g: any) => (g.id === guildId ? { ...g, botPrefix: body.prefix } : g));
      await redis.set(`user-guilds:${user.id}`, JSON.stringify(updatedGuilds), "EX", 600);
    }

    return c.json({
      prefix: config.prefix,
    });
  } catch (error) {
    console.error("Error updating prefix:", error);
    return c.json({ message: "Internal server error" });
  }
});

router.patch("/follow-updates", async (c) => {
  const guildId = c.req.param('guildId')

  const user = c.get("user");

    if (!user?.accessToken) {
       return httpError(HttpErrorMessage.MissingAccess)
    }

  const body = await c.req.json();

  try {
    let config = await FollowUpdates.findOne({ where: { guildId: guildId } });

        if (config) {
      const keys: Array<"id"> = 
      ["id"];
      
      for (const key of keys) {
        if (key in body) {
          (config as any)[key] = body[key];
        }
      }
      await config.save();
    } else {
      config = await FollowUpdates.create({
        guildId: guildId,
        id: body.channelId,
      });
    }

    return c.json({
      id: config.id,
    });
  } catch (error) {
    console.error("Error updating follow-updates:", error);
  }
});

export default router;