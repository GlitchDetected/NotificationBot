import { BskyAgent } from "@atproto/api";
import axios from "axios";
import { Hono } from "hono";

import appConfig from "@/src/config";
import { now } from "@/src/constants/global";
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
                    username: config.creator?.username ?? "Unknown",
                    avatarUrl: config.creator?.avatar_url ?? null,
                    customUrl: config.creator?.custom_url ?? null
                }
            })));
    } catch (error) {
        console.error("Error fetching notification configuration:", error);
        return c.json({ error: "Failed to fetch notifications" }, 500);
    }
});

router.post("/", async (c) => {
    const guildId = c.req.param("guildId");

    try {
        const body = await c.req.json();
        // console.log("Received body:", body);

        const existing = await getNotificationByGuild(guildId!);
        if (existing.length >= 10) {
            return c.json({ error: "Guild has reached the max of 10 notifications." }, 400);
        }

        const defaultMessage: Record<NotificationType, string> = {
            [NotificationType.YouTube]: "Hey {ping}, **{creator.name}** just posted a new video! {video.link}",
            [NotificationType.Twitch]: "Hey {ping}, **{creator.name}** just went live!\n{stream.link}",
            [NotificationType.Bluesky]: "Hey {ping}, {creator.handle} just posted!\n{post.link}",
            [NotificationType.Reddit]: "Hey {ping}, {author.name} just posted in **{subreddit.name}**!\n{post.link}",
            [NotificationType.GitHub]: "Hey {ping}, new release in **{repo.name}**: {release.title}\n{release.link}"
        };

        async function defaultAvatarUrl(type: NotificationType, creatorId: string): Promise<string | null> {
            switch (type) {
                case NotificationType.YouTube:
                    return await getYouTubeAvatar(creatorId);
                case NotificationType.Twitch:
                    return `https://static-cdn.jtvnw.net/jtv_user_pictures/${creatorId}-profile_image-300x300.png`;
                case NotificationType.Bluesky:
                    return `https://cdn.bsky.app/img/avatar/plain/${creatorId}@jpeg`;
                case NotificationType.Reddit:
                    return "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png";
                case NotificationType.GitHub:
                    const owner = creatorId.split("/")[0];
                    return `https://github.com/${owner}.png`;
                default:
                    return null;
            }
        }

        let avatarUrl: string | null = null;
        let creatorId: string | null = null;
        let creatorUsername: string | null = null;

        const type = Number(body.type);

        switch (type) {
            case NotificationType.YouTube: {
                if (!body.creatorHandle) {
                    return c.json({ error: "creatorHandle is required for YouTube." }, 400);
                }

                creatorId = await getYtChannelId(body.creatorHandle);

                if (!creatorId) {
                    return c.json({ error: "YouTube channel not found." }, 404);
                }

                const latestVideo = await fetchers[NotificationType.YouTube]({
                    ...body,
                    creator_id: creatorId // Note: using creator_id, not creatorId
                } as any);

                if (!latestVideo) {
                    return c.json({ error: "YouTube channel has no videos." }, 400);
                }

                creatorUsername = body.creatorHandle;
                break;
            }

            case NotificationType.Twitch: {
                if (!body.creatorHandle) {
                    return c.json({ error: "creatorHandle is required for Twitch." }, 400);
                }

                const clientId = appConfig.apiSecrets.twitchClientId;
                const clientSecret = appConfig.apiSecrets.twitchClientSecret;

                if (!clientId || !clientSecret) {
                    return c.json({ error: "Twitch credentials not configured." }, 500);
                }

                const tokenResp = await axios.post(
                    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`
                );
                const accessToken = tokenResp.data.access_token;

                const userResp = await axios.get(
                    `https://api.twitch.tv/helix/users?login=${body.creatorHandle}`,
                    {
                        headers: {
                            "Client-ID": clientId,
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                );
                const user = userResp.data.data?.[0];
                if (!user) {
                    return c.json({ error: "Twitch user not found." }, 404);
                }

                creatorId = user.id;
                creatorUsername = body.creatorHandle;
                avatarUrl = user.profile_image_url ?? null;

                await fetchers[NotificationType.Twitch]({
                    ...body,
                    creator: { username: creatorUsername }
                } as any);

                break;
            }

            case NotificationType.Bluesky: {
                if (!body.creatorHandle) {
                    return c.json({ error: "creatorHandle is required for Bluesky." }, 400);
                }

                const agent = new BskyAgent({ service: "https://bsky.social" });

                if (!appConfig.apiSecrets.blueskyIdentifier || !appConfig.apiSecrets.blueskyPassword) {
                    return c.json({ error: "Bluesky credentials not configured." }, 500);
                }

                await agent.login({
                    identifier: appConfig.apiSecrets.blueskyIdentifier,
                    password: appConfig.apiSecrets.blueskyPassword
                });

                const profile = await agent.getProfile({ actor: body.creatorHandle });
                if (!profile.data) {
                    return c.json({ error: "Bluesky user not found." }, 404);
                }

                creatorId = profile.data.did;
                creatorUsername = body.creatorHandle;
                avatarUrl = profile.data.avatar ?? null;

                const latestPost = await fetchers[NotificationType.Bluesky]({
                    ...body,
                    creator: { username: creatorUsername }
                } as any);

                if (!latestPost) {
                    return c.json({ error: "Bluesky user has no posts." }, 400);
                }

                break;
            }

            case NotificationType.Reddit: {
                if (!body.creatorHandle) {
                    return c.json({ error: "creatorHandle is required for Reddit." }, 400);
                }

                creatorId = body.creatorHandle;
                creatorUsername = body.creatorHandle;

                const latestRedditPost = await fetchers[NotificationType.Reddit]({
                    ...body,
                    creator: { username: creatorUsername }
                } as any);

                if (!latestRedditPost) {
                    return c.json({ error: "Reddit subreddit not found or has no posts." }, 400);
                }

                break;
            }

            case NotificationType.GitHub: {
                if (!body.creatorHandle) {
                    return c.json({ error: "creatorHandle is required for GitHub." }, 400);
                }

                // Validate format (owner/repo)
                const parts = body.creatorHandle.split("/");
                if (parts.length !== 2) {
                    return c.json({ error: "Invalid GitHub repository format. Use: owner/repo" }, 400);
                }

                const [owner, repo] = parts;
                creatorId = body.creatorHandle; // Use the full owner/repo as ID
                creatorUsername = body.creatorHandle;

                // Verify repository exists
                try {
                    const repoResp = await axios.get(
                        `https://api.github.com/repos/${owner}/${repo}`,
                        {
                            headers: {
                                Accept: "application/vnd.github.v3+json",
                                "User-Agent": "NotificationBot/1.0"
                            },
                            validateStatus: (status) => status < 500
                        }
                    );

                    if (repoResp.status === 404) {
                        return c.json({ error: "GitHub repository not found." }, 404);
                    }

                    if (repoResp.status !== 200) {
                        return c.json({ error: "Failed to verify GitHub repository." }, 400);
                    }

                } catch (error) {
                    console.error("GitHub verification error:", error);
                    return c.json({ error: "Failed to verify GitHub repository." }, 500);
                }

                break;
            }

            default:
                return c.json({ error: "Unsupported notification type." }, 400);
        }

        if (!creatorId) {
            console.error("Creator ID is null after switch statement");
            return c.json({ error: "Failed to retrieve creator ID." }, 400);
        }

        const config = await upsertNotification({
            id: crypto.randomUUID(),
            guild_id: guildId!,
            channel_id: body.channelId,
            role_id: body.roleId ?? null,
            type: type,
            flags: body.flags ?? 0,
            regex: body.regex ?? null,
            creator_id: creatorId,
            message: {
                content: body.message?.content ?? defaultMessage[type],
                embed: body.message?.embed ?? null
            },
            creator: {
                id: creatorId,
                username: creatorUsername,
                avatar_url: avatarUrl ?? await defaultAvatarUrl(type, creatorId),
                custom_url: body.customUrl ?? null
            },
            created_at: now,
            updated_at: now
        });
        return c.json(config);

    } catch (error) {
        console.error("Error creating/updating notification configuration:", error);
        return c.json({
            error: "Internal server error",
            details: error instanceof Error ? error.message : String(error)
        }, 500);
    }
});

export default router;