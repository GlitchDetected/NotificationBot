import axios from "axios";

import type { ContentData, notificationConfig, NotificationType } from "@/typings";

import appConfig from "../config";

// YouTube
async function fetchLatestYouTubeContent(config: notificationConfig): Promise<ContentData | null> {
    try {
        const apiKey = appConfig.apiSecrets.youtubeAPI;
        if (!apiKey) throw new Error("Missing YouTube API key");

        const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${config.creatorId}&part=snippet,id&order=date&maxResults=1&type=video`;
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
            channelUrl: `https://youtube.com/channel/${config.creatorId}`,
            link: `https://youtube.com/watch?v=${videoId}`
        };
    } catch (err) {
        console.error("YouTube fetch error:", err);
        return null;
    }
}

// Twitch
async function fetchLatestTwitchContent(config: notificationConfig): Promise<ContentData | null> {
    try {
        const clientId = process.env.TWITCH_CLIENT_ID;
        const clientSecret = process.env.TWITCH_CLIENT_SECRET;
        if (!clientId || !clientSecret) throw new Error("Missing Twitch credentials");

        const tokenResp = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`);
        const accessToken = tokenResp.data.access_token;

        const username = config.creator?.username;

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
async function fetchLatestBlueskyContent(config: notificationConfig): Promise<ContentData | null> {
    try {
        const blueskyHandle = config.creator.username;
        const url = `https://bsky.app/api/profile/${blueskyHandle}/posts?limit=1`;
        const response = await axios.get(url);

        const post = response.data.posts?.[0];
        if (!post) return null;

        return {
            id: post.cid,
            type: post.type,
            text: post.text,
            timestamp: Math.floor(new Date(post.createdAt).getTime() / 1000),
            creator: {
                posts: post.author.postsCount || 0,
                followers: post.author.followersCount || 0
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
        const subreddit = config.creator.username;

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

export const fetchers: Record<NotificationType, (config: notificationConfig) => Promise<ContentData | null>> = {
    0: fetchLatestYouTubeContent,
    1: fetchLatestTwitchContent,
    2: fetchLatestBlueskyContent,
    3: fetchLatestRedditContent
};