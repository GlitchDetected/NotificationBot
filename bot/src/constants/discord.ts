import type { GuildMember, User } from "discord.js";

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