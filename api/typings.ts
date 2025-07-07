export enum NotificationType {
  YouTube = 0,
  Twitch = 1,
  Bluesky = 2,
  Reddit = 3
}

export enum NotificationFlags {
  SendReposts = 1 << 0,
  SendReplies = 1 << 1,
  SendQuotes = 1 << 2,
  MustContainImage = 1 << 3
}