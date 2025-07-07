import { Hono } from 'hono';
import Notifications from "@/database/models/notifications";
import { httpError } from '@/utils/httperror';
import { HttpErrorMessage } from '@/utils/httpjson';
import { NotificationType } from '../../../../../../typings';
import getYouTubeAvatar from '@/lib/youtube';
const router = new Hono();

import notificationIdRouter from "./[id]";
import { config } from 'dotenv';
router.route("/:id", notificationIdRouter); // dynamic route


router.get("/", async (c) => {
  const guildId = c.req.param('guildId')

  try {
    const configs = await Notifications.findAll({ where: { guildId } });

if (configs.length === 0) {
  return c.json({
    creator: { 
      id: null,
      username: null,
      avatarUrl: null,
      customUrl: null,
    }
  });
}

        return c.json(
      configs.map(config => ({
        id: config.id ?? null,
        guildId: config.guildId ?? null,
        channelId: config.channelId ?? null,
        roleId: config.roleId ?? null,
        type: config.type ?? null,
        flags: config.flags ?? null,
        regex: config.regex ?? null,
        creatorId: config.creatorId ?? null,
        message: { 
          content: config.message?.content ?? null,
          embed: config.message?.embed ?? null,
        },
        creator: { 
          id: config.creator?.id ?? null,
          username: config.creator?.username ?? null,
          avatarUrl: config.creator?.avatarUrl ?? null,
          customUrl: config.creator?.customUrl ?? null,
          },
        })));
} catch (error) {
    console.error("Error fetching notification configuration:", error);
  }
});

router.post("/", async (c) => {
  const guildId = c.req.param('guildId')
  const body = await c.req.json();

    const defaultMessage: Record<NotificationType, string> = {
    [NotificationType.YouTube]: "Hey {ping}, **{creator.name}** just posted a new video! {video.link}",
    [NotificationType.Twitch]: "Hey {ping}, **{creator.name}** just went live!\n{stream.link}",
    [NotificationType.Bluesky]: "Hey {ping}, {creator.handle} just posted!\n{post.link}",
    [NotificationType.Reddit]: "Hey {ping}, {author.name} just posted in **{subreddit.name}**!\n{post.link}",
  };

  function defaultAvatarUrl(type: NotificationType, creatorId: string, channelId: string): string | null {
  switch (type) {
    case NotificationType.YouTube:
      getYouTubeAvatar(channelId);
    case NotificationType.Twitch:
      return `https://static-cdn.jtvnw.net/jtv_user_pictures/${creatorId}-profile_image-300x300.png`;
    case NotificationType.Bluesky:
      return `https://cdn.bsky.app/img/avatar/plain/did:plc:${creatorId}@jpeg`;
    case NotificationType.Reddit:
      return `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png`;
    default:
      return null;
  }
}

  try {
      const config = await Notifications.create({
        id: crypto.randomUUID(),
        guildId: guildId,
        channelId: body.channelId,
        roleId: body.roleId ?? null,
        type: body.type,
        flags: body.flags ?? 0,
        regex: body.regex ?? null,
        creatorId: body.creatorId,
        message: {
  content: body.message?.content ?? defaultMessage[body.type as NotificationType],
  embed: body.message?.embed ?? defaultMessage[body.type as NotificationType],
},
        creator: {
          id: body.creatorId,
          username: body.creatorHandle,
          avatarUrl: body.avatarUrl ?? defaultAvatarUrl(body.type as NotificationType, body.creatorId, body.channelId),
          customUrl: body.customUrl ?? null,
        },
        createdAt: new Date(),
      });

    return c.json(config);
  } catch (error) {
    console.error("Error creating/updating notification configuration:", error);
  }
});

export default router;