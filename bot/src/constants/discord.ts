import type { GuildMember, User } from "discord.js";


export const guildMemberInfo = (member: GuildMember) => {
    const user = member.user;

    return {
        "user.mention": `<@${user.id}>`,
        "user.id": user.id,
        "user.tag": user.tag,
        "user.name": user.username,
        "user.avatar": user.displayAvatarURL()
    };
};

export const guildInfo = (member: GuildMember) => {
    const guild = member.guild;

    return {
        "guild.name": guild.name,
        "guild.id": guild.id,
        "guild.avatar": guild.iconURL() || "",
        "guild.rules": guild.rulesChannel ? `<#${guild.rulesChannel.id}>` : "",
        "guild.memberCount": guild.memberCount
    };
};

export const inviterInfo = (inviter: User | null, inviteCode?: string, inviteCount?: number) => {
    if (!inviter) return {};

    return {
        "inviter.mention": `<@${inviter.id}>`,
        "inviter.id": inviter.id,
        "inviter.tag": inviter.tag,
        "inviter.name": inviter.username,
        "inviter.avatar": inviter.displayAvatarURL(),
        "inviter.code": inviteCode || "",
        "inviter.count": inviteCount || 0
    };
};