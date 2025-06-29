import { PermissionFlagsBits } from "discord-api-types/v10";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getBaseUrl, getCanonicalUrl } from "@/lib/urls";

import { createSession } from "./api";

const defaultCookieOptions = {
  secure: getBaseUrl().startsWith("http://"),
  httpOnly: true,
  sameSite: "none",
  domain: getBaseUrl().split("://")[1],
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28)
} as const;

const permissions = [
  PermissionFlagsBits.AddReactions,
  PermissionFlagsBits.AttachFiles,
  PermissionFlagsBits.BanMembers, 
  PermissionFlagsBits.Connect,
  PermissionFlagsBits.CreatePublicThreads, 
  PermissionFlagsBits.EmbedLinks, 
  PermissionFlagsBits.KickMembers,
  PermissionFlagsBits.ManageChannels, 
  PermissionFlagsBits.ManageGuild,
  PermissionFlagsBits.ManageMessages, 
  PermissionFlagsBits.ManageRoles,
  PermissionFlagsBits.ManageWebhooks,
  PermissionFlagsBits.MentionEveryone,
  PermissionFlagsBits.ModerateMembers,
  PermissionFlagsBits.ReadMessageHistory,
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.SendMessagesInThreads,
  PermissionFlagsBits.Speak, 
  PermissionFlagsBits.UseExternalEmojis, 
  PermissionFlagsBits.ViewChannel 
];

export async function GET(request: Request) {
  if (request.headers.get("user-agent")?.includes("Discordbot/2.0")) redirect("/login/open-graph");

  const { searchParams } = new URL(request.url);
  const jar = await cookies();

  const logout = searchParams.get("logout");

  if (logout) {
    jar.set("sessiontoken", "", {
      expires: new Date(0),
      domain: getBaseUrl().split("://")[1]
    });

    redirect("/");
  }

  const guildId = searchParams.get("guild_id");
  const invite = Boolean(searchParams.get("invite"));
  const code = searchParams.get("code");

  if (!code) {
    const callback = searchParams.get("callback");
    const lastpage = jar.get("lastpage");

    const url = generateOauthUrl(invite, callback || lastpage?.value, guildId);
    redirect(url);
  }

  const res = await createSession(code);
  let redirectUrl = getRedirectUrl(searchParams);

  if (!res || "code" in res) {
    const data = { statusCode: 500, message: "Failed to authenticate with Discord." };
    console.log(data);

    redirectUrl += "?error=" + JSON.stringify(data);
    redirect(redirectUrl);
  }

  jar.set("sessiontoken", res.sessiontoken, defaultCookieOptions);

  redirect(redirectUrl);
}

function generateOauthUrl(invite: boolean, redirectUrl: string | undefined, guildId: string | null) {
  const params = new URLSearchParams();

  params.append("client_id", process.env.CLIENT_ID as string);
  params.append("redirect_uri", getCanonicalUrl("login"));
  params.append("permissions", permissions.reduce((acc, cur) => acc + Number(cur), 0).toString());
  params.append("prompt", "none");
  params.append("response_type", "code");
  params.append("state", encodeURIComponent(redirectUrl || "/"));

  if (invite) params.append("scope", "identify guilds bot");
  else params.append("scope", "identify guilds email");

  if (guildId) params.append("guild_id", guildId);

  return "https://discord.com/oauth2/authorize?" + params.toString();
}

function getRedirectUrl(searchParams: URLSearchParams) {
  const redirectUrl = parseRedirectUrlFromState(searchParams.get("state"));
  const guildId = searchParams.get("guild_id");

  if (guildId) return `/dashboard/${guildId}${redirectUrl}`;
  return redirectUrl;
}

function parseRedirectUrlFromState(state: string | null) {
  if (!state) return "/";

  const path = decodeURIComponent(state);
  if (path.includes("://")) return "/";

  return path || "/";
}
