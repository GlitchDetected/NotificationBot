/* eslint-disable @typescript-eslint/no-explicit-any */
import { BskyAgent } from "@atproto/api";
import axios from "axios";

import type { ContentData, notificationConfig, NotificationType } from "@/typings";

import appConfig from "../config";

const agent = new BskyAgent({ service: "https://bsky.social" });

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 403) {
            // Ignore all 403s globally
            return Promise.resolve({ data: null });
        }
        return Promise.reject(error);
    }
);

async function bskySession() {
    if (!agent.session) {
        await agent.login({
            identifier: appConfig.apiSecrets.blueskyIdentifier,
            password: appConfig.apiSecrets.blueskyPassword
        });
    }
}

// YouTube
async function fetchLatestYouTubeContent(config: notificationConfig): Promise<ContentData | null> {
    try {
        const apiKey = appConfig.apiSecrets.youtubeAPI;
        if (!apiKey) throw new Error("Missing YouTube API key");

        const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${config.creator_id}&part=snippet,id&order=date&maxResults=1&type=video`;
        const response = await axios.get(url);
        const item = response.data.items?.[0];
        if (!item) return null;

        const videoId = item.id.videoId;
        const snippet = item.snippet;

        const videoUrl = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoId}&part=statistics,snippet`;
        const videoDetailsResp = await axios.get(videoUrl);
        const videoDetails = videoDetailsResp.data.items?.[0];

        if (!videoDetails) return null;

        return {
            id: videoId,
            videoTitle: snippet.title,
            videoId,
            timestamp: Math.floor(new Date(snippet.publishedAt).getTime() / 1000),
            subscriberCount: videoDetails.statistics?.subscriberCount || "0",
            videoCount: videoDetails.statistics?.videoCount || "0",
            viewCount: videoDetails.statistics?.viewCount || "0",
            channelUrl: `https://youtube.com/channel/${config.creator_id}`,
            link: `https://youtube.com/watch?v=${videoId}`
        };
    } catch (err: any) {
        // Silently ignore 403 Forbidden errors
        if (axios.isAxiosError(err) && err.response?.status === 403) {
            return null;
        }

        return null;
    }
}

// Twitch
async function fetchLatestTwitchContent(config: notificationConfig): Promise<ContentData | null> {
    try {
        const clientId = appConfig.apiSecrets.twitchClientId;
        const clientSecret = appConfig.apiSecrets.twitchClientSecret;
        if (!clientId || !clientSecret) throw new Error("Missing Twitch credentials");

        const tokenResp = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`);
        const accessToken = tokenResp.data.access_token;

        const username = config.creator?.username || (config as any).creatorHandle;
        if (!username) throw new Error("Missing username");

        if (!username) {
            return null;
        }

        const userResp = await axios.get(`https://api.twitch.tv/helix/users?login=${username}`, {
            headers: { "Client-ID": clientId, Authorization: `Bearer ${accessToken}` }
        });
        const user = userResp.data.data?.[0];
        if (!user) return null;

        const streamResp = await axios.get(`https://api.twitch.tv/helix/streams?user_id=${user.id}`, {
            headers: { "Client-ID": clientId, Authorization: `Bearer ${accessToken}` }
        });
        const stream = streamResp.data.data?.[0];
        if (!stream) return null; // if offline

        return {
            id: stream.id,
            title: stream.title,
            game: stream.game_name,
            thumbnail: stream.thumbnail_url.replace("{width}", "640").replace("{height}", "360"),
            startedAt: Math.floor(new Date(stream.started_at).getTime() / 1000),
            link: `https://twitch.tv/${username}`
        };
    } catch (err) {
        console.error("Twitch fetch error:", err);
        return null;
    }
}

// Bluesky
export async function fetchLatestBlueskyContent(
    config: notificationConfig
): Promise<ContentData | null> {
    try {
        await bskySession();

        const blueskyHandle = config.creator?.username || (config as any).creatorHandle;
        if (!blueskyHandle) throw new Error("Missing blueskyHandle");

        const feed = await agent.getAuthorFeed({ actor: blueskyHandle, limit: 1 });
        const item = feed.data.feed?.[0];
        if (!item) return null;

        const post = item.post; // PostView
        const author = post.author; // ProfileViewBasic

        return {
            id: post.cid,
            type: post.$type,
            text: (post.record as any)?.text || "",
            timestamp: Math.floor(new Date(post.indexedAt).getTime() / 1000),
            creator: {
                posts: (author as any).postsCount || 0,
                followers: (author as any).followersCount || 0
            },
            link: `https://bsky.app/profile/${blueskyHandle}/post/${post.cid}`
        };
    } catch (err) {
        console.error("Bluesky fetch error:", err);
        return null;
    }
}


// reddit
async function fetchLatestRedditContent(config: notificationConfig): Promise<ContentData | null> {
    try {
        const subreddit = config.creator?.username || (config as any).creatorHandle;
        if (!subreddit) throw new Error("Missing subreddit name");

        const url = `https://www.reddit.com/r/${subreddit}/new.json?limit=1`;
        const response = await axios.get(url, { headers: { "User-Agent": "DiscordBot/1.0" } });

        const post = response.data.data.children?.[0]?.data;
        if (!post) return null;

        return {
            id: post.id,
            title: post.title,
            text: post.selftext || "",
            thumbnail: post.thumbnail && post.thumbnail.startsWith("http") ? post.thumbnail : "",
            flair: post.link_flair_text || "",
            timestamp: Math.floor(post.created_utc),
            author: {
                username: post.author,
                id: post.author_fullname || ""
            },
            subreddit: {
                name: `r/${subreddit}`,
                id: post.subreddit_id,
                members: "0"
            },
            link: `https://reddit.com${post.permalink}`
        };
    } catch (err) {
        console.error("Reddit fetch error:", err);
        return null;
    }
}

export const fetchers: Record<
    NotificationType,
    (config: notificationConfig) => Promise<ContentData | null>
> = {
    0: fetchLatestYouTubeContent,
    1: fetchLatestTwitchContent,
    2: fetchLatestBlueskyContent,
    3: fetchLatestRedditContent
};