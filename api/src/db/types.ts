import type { ColumnType, Generated } from "kysely";

import type { GuildEmbed } from "@/typings";

export interface ByeTable {
    guildId: string;
    enabled: boolean | null;
    channelId: string | null;
    webhookURL: string | null;

    message: {
        content: string | null;
        embed?: GuildEmbed;
    } | null;

    deleteAfter: number | null;

    card: {
        enabled: boolean;
        inEmbed: boolean;
        background?: string;
        textColor?: number;
    } | null;

    createdAt: ColumnType<Date, string | undefined, never>;
    updatedAt: ColumnType<Date, string | undefined, never>;
}

export interface DmNotificationsTable {
    userId: string;
    enabled: boolean | null;
    embedcolor: number | null;
    source: string | null;
    thumbnail: string | null;
    message: string | null;
    createdAt: ColumnType<Date, string | undefined, never>;
    updatedAt: ColumnType<Date, string | undefined, never>;
}

export interface FollowUpdatesTable {
    guildId: string;
    channelId: string | null;
    name: string | null;
}

export interface NotificationsTable {
    id: Generated<string>;
    guildId: string;
    channelId: string;
    roleId: string | null;
    type: 0 | 1 | 2 | 3 | null;
    flags: number | null;
    regex: string | null;
    creatorId: string | null;

    message: {
        content: string | null;
        embed?: GuildEmbed;
    } | null;

    creator: {
        id: string;
        username: string;
        customUrl: string;
        avatarUrl: string | null;
    } | null;

    createdAt: ColumnType<Date, string | undefined, never>;
    updatedAt: ColumnType<Date, string | undefined, never>;
}


export interface ReviewsTable {
    guildId: string;
    name: string | null;
    icon: string | null;
    memberCount: number | null;
    review: string | null;

    createdAt: ColumnType<Date, string | undefined, never>;
    updatedAt: ColumnType<Date, string | undefined, never>;
}

export interface UserTable {
    id: string;
    email: string;
    username: string;
    displayName: string | null;
    avatarHash: string | null;
    accessToken: string;
    refreshToken: string;

    createdAt: ColumnType<Date, string | undefined, never>;
    updatedAt: ColumnType<Date, string | undefined, never>;
}

export interface WelcomeTable {
    guildId: string;
    enabled: boolean | null;
    channelId: string | null;

    message: {
        content: string | null;
        embed?: GuildEmbed;
    } | null;

    roleIds: string[];
    pingIds: string[];

    deleteAfter: number | null;
    deleteAfterLeave: boolean | null;
    isRestorable: boolean;

    dm: {
        enabled: boolean;
        message: {
            content?: string;
            embed?: GuildEmbed;
        };
    } | null;

    reactions: {
        welcomeMessageEmojis: string[];
        firstMessageEmojis: string[];
    } | null;

    card: {
        enabled: boolean;
        inEmbed: boolean;
        background?: string;
        textColor?: number;
    } | null;

    button: {
        enabled: boolean;
        style: 1 | 2 | 3 | 4;
        emoji?: string | null;
        label?: string | null;
        ping?: boolean;
        type: 0;
    } | null;

    welcomeMessageIds: Record<string, string> | null;

    createdAt: ColumnType<Date, string | undefined, never>;
    updatedAt: ColumnType<Date, string | undefined, never>;
}


export interface Database {
    bye: ByeTable;
    dmnotifications: DmNotificationsTable;
    followupdates: FollowUpdatesTable;
    notifications: NotificationsTable;
    reviews: ReviewsTable;
    user: UserTable;
    welcome: WelcomeTable;
}