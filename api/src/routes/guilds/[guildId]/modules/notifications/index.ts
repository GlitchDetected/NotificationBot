import { Hono } from "hono";

import { getNotificationByGuild, upsertNotification } from "@/src/db/models/notifications";
import { fetchers } from "@/src/lib/getUploads";
import getYouTubeAvatar from "@/src/lib/youtube";
import { getYtChannelId } from "@/src/lib/youtube";
import { NotificationType } from "@/typings";
const router = new Hono();

import notificationIdRouter from "./[id]";
router.route("/:id", notificationIdRouter); // dynamic route


router.get("/", async (c) => {
    const guildId = c.req.param("guildId");

    if (!guildId) {
        return c.json({ error: "guildId parameter is required" });
    }

    try {
        const configs = await getNotificationByGuild(guildId);

        if (configs.length === 0) {
            return c.json({
                creator: {
                    id: null,
                    username: null,
                    avatarUrl: null,
                    customUrl: null
                }
            });
        }

        return c.json(
            configs.map((config) => ({
                id: config.id ?? null,
                guildId: config.guild_id ?? null,
                channelId: config.channel_id ?? null,
                roleId: config.role_id ?? null,
                type: config.type ?? null,
                flags: config.flags ?? null,
                regex: config.regex ?? null,
                creatorId: config.creator_id ?? null,
                message: {
                    content: config.message?.content ?? null,
                    embed: config.message?.embed ?? null
                },
                creator: {
                    id: config.creator?.id ?? null,
                    username: config.creator?.username ?? null,
                    avatarUrl: config.creator?.avatar_url ?? null,
                    customUrl: config.creator?.custom_url ?? null
                }
            })));
    } catch (error) {
        console.error("Error fetching notification configuration:", error);
    }
});

router.post("/", async (c) => {
    const guildId = c.req.param("guildId");
    const body = await c.req.json();

    const defaultMessage: Record<NotificationType, string> = {
        [NotificationType.YouTube]: "Hey {ping}, **{creator.name}** just posted a new video! {video.link}",
        [NotificationType.Twitch]: "Hey {ping}, **{creator.name}** just went live!\n{stream.link}",
        [NotificationType.Bluesky]: "Hey {ping}, {creator.handle} just posted!\n{post.link}",
        [NotificationType.Reddit]: "Hey {ping}, {author.name} just posted in **{subreddit.name}**!\n{post.link}"
    };

    async function defaultAvatarUrl(type: NotificationType, creatorId: string): Promise<string | null> {
        switch (type) {
            case NotificationType.YouTube:
                return await getYouTubeAvatar(creatorId);
            case NotificationType.Twitch:
                return `https://static-cdn.jtvnw.net/jtv_user_pictures/${creatorId}-profile_image-300x300.png`;
            case NotificationType.Bluesky:
                return `https://cdn.bsky.app/img/avatar/plain/did:plc:${creatorId}@jpeg`;
            case NotificationType.Reddit:
                return "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png";
            default:
                return null;
        }
    }

    try {
        let creatorId: string | null = null;
        let creatorUsername: string | null = null;

        switch (body.type) {
            case NotificationType.YouTube:
                if (body.creatorHandle) {
                    creatorId = await getYtChannelId(body.creatorHandle);
                    if (!creatorId) return c.json({ error: "YouTube channel not found." }, 404);

                    const latestVideo = await fetchers[NotificationType.YouTube]({ ...body, creatorId: creatorId });
                    if (!latestVideo) return c.json({ error: "YouTube channel has no videos." }, 400);

                    creatorUsername = body.creatorHandle;
                }
                break;

            case NotificationType.Twitch:
                const latestStream = await fetchers[NotificationType.Twitch](body);
                if (!latestStream) return c.json({ error: "Twitch user has no live stream history." }, 400);

                creatorUsername = body.creatorHandle ?? null;
                break;

            case NotificationType.Bluesky:
                const latestPost = await fetchers[NotificationType.Bluesky](body);
                if (!latestPost) return c.json({ error: "Bluesky user has no posts." }, 400);

                creatorUsername = body.creatorHandle ?? null;
                break;

            case NotificationType.Reddit:
                const latestRedditPost = await fetchers[NotificationType.Reddit](body);
                if (!latestRedditPost) return c.json({ error: "Reddit user has no posts." }, 400);

                creatorUsername = body.creatorHandle ?? null;
                break;

            default:
                return c.json({ error: "Unsupported notification type." }, 400);
        }

        const config = await upsertNotification({
            id: crypto.randomUUID(),
            guild_id: guildId!,
            channel_id: body.channelId,
            role_id: body.roleId ?? null,
            type: body.type,
            flags: body.flags ?? 0,
            regex: body.regex ?? null,
            creator_id: creatorId ?? null,
            message: {
                content: body.message?.content ?? defaultMessage[body.type as NotificationType],
                embed: body.message?.embed ?? null
            },
            creator: {
                id: creatorId ?? null,
                username: creatorUsername,
                avatar_url: body.avatarUrl ?? await defaultAvatarUrl(body.type as NotificationType, creatorId ?? ""),
                custom_url: body.customUrl ?? null
            },
            created_at: new Date().toISOString()
        });

        return c.json(config);
    } catch (error) {
        console.error("Error creating/updating notification configuration:", error);
    }
});

export default router;