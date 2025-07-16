export interface ContentData {
  id: string;
  link?: string;
  [key: string]: any;
}

export enum NotificationType {
  YouTube = 0,
  Twitch = 1,
  Bluesky = 2,
  Reddit = 3
}

export interface GuildEmbed {
    title: string | null;
    description: string | null;
    thumbnail: string | null;
    image: string | null;
    color: number;
    footer: {
        text: string | null;
        icon_url: string | null;
    };
}

export type notificationConfig = {
  id: string;
  guildId: string;
  channelId: string;
  roleId: string | null;

  type: 0 | 1 | 2 | 3;
  flags: number;
  regex: string | null;

  creatorId: string;

  message?: {
    content: string | null;
    embed?: GuildEmbed;
  };

  creator: {
    id: string;
    username: string;
    customUrl: string;
    avatarUrl: string | null;
  };
};