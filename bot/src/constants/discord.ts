/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Guild, GuildMember, User } from "discord.js";

import type { ContentData, notificationConfig, NotificationType } from "@/typings";

export const welcomerPlaceholders = (member: GuildMember, inviter: User | null, inviteCode?: string, inviteCount?: number) => {
    const user = member.user;
    const guild = member.guild;
    if (!inviter) return {};

    return {
        // user
        "user.mention": `<@${user.id}>`,
        "user.id": user.id,
        "user.tag": user.tag,
        "user.name": user.username,
        "user.avatar": user.displayAvatarURL(),

        // guild
        "guild.name": guild.name,
        "guild.id": guild.id,
        "guild.avatar": guild.iconURL() || "",
        "guild.rules": guild.rulesChannel ? `<#${guild.rulesChannel.id}>` : "",
        "guild.memberCount": guild.memberCount,

        // inviter
        "inviter.mention": `<@${inviter.id}>`,
        "inviter.id": inviter.id,
        "inviter.tag": inviter.tag,
        "inviter.name": inviter.username,
        "inviter.avatar": inviter.displayAvatarURL(),
        "inviter.code": inviteCode || "",
        "inviter.count": inviteCount || 0
    };
};

export const notificationPlaceholders = (
    guild: Guild,
    config: notificationConfig,
    type: NotificationType,
    contentData: ContentData
) => {
    const placeholders: Record<string, any> = {
        "creator.name": config.creator.username,
        "creator.id": config.creator.id,
        "creator.link": config.creator.customUrl,
        "creator.avatar": config.creator.avatarUrl || "",

        // Guild meta
        "guild.name": guild.name,
        "guild.id": guild.id,
        "guild.avatar": guild.iconURL() || "",
        "guild.rules": guild.rulesChannel ? `<#${guild.rulesChannel.id}>` : "",
        "guild.memberCount": guild.memberCount.toLocaleString(),

        ping: config.roleId ? `<@&${config.roleId}>` : ""
    };

    // Platform-specific placeholders
    switch (type) {
        case 0: // YouTube
            Object.assign(placeholders, {
                "video.title": contentData.videoTitle,
                "video.id": contentData.videoId,
                "video.link": `https://youtube.com/watch?v=${contentData.videoId}`,
                "video.thumbnail": `https://i4.ytimg.com/vi/${contentData.videoId}/hqdefault.jpg`,
                "video.uploaded.ago": `<t:${contentData.timestamp}:R>`,
                "video.uploaded.at": `<t:${contentData.timestamp}:f>`,
                "creator.subs": contentData.subscriberCount,
                "creator.videos": contentData.videoCount,
                "creator.views": contentData.viewCount
            });
            break;

        case 1: // Reddit
            Object.assign(placeholders, {
                "post.id": contentData.id,
                "post.title": contentData.title,
                "post.text": contentData.text || "",
                "post.thumbnail": contentData.thumbnail || "",
                "post.flair": contentData.flair || "",
                "post.posted.ago": `<t:${contentData.timestamp}:R>`,
                "post.posted.at": `<t:${contentData.timestamp}:f>`,
                "author.username": contentData.author.username,
                "author.id": contentData.author.id,
                "author.link": `https://reddit.com/user/${contentData.author.username}`,
                "subreddit.name": contentData.subreddit.name,
                "subreddit.id": contentData.subreddit.id,
                "subreddit.members": contentData.subreddit.members
            });
            break;

        case 2: // Twitch
            Object.assign(placeholders, {
                "stream.title": contentData.title,
                "stream.id": contentData.id,
                "stream.link": `https://twitch.tv/${config.creator.username}`,
                "stream.game": contentData.game || "",
                "stream.thumbnail": contentData.thumbnail,
                "stream.live.since": `<t:${contentData.startedAt}:R>`,
                "stream.live.start": `<t:${contentData.startedAt}:f>`
            });
            break;

        case 3: // Bluesky
            Object.assign(placeholders, {
                "post.id": contentData.id,
                "post.type": contentData.type,
                "post.text": contentData.text,
                "post.link": contentData.link,
                "post.posted.ago": `<t:${contentData.timestamp}:R>`,
                "post.posted.at": `<t:${contentData.timestamp}:f>`,
                "creator.handle": config.creator.username,
                "creator.posts": contentData.creator.posts,
                "creator.followers": contentData.creator.followers
            });
            break;
    }

    return placeholders;
};