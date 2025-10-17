import { HiCheckCircle, HiHand } from "react-icons/hi";

import { UserAvatar } from "@/components/ui/avatar";
import { Marquee } from "@/components/ui/marquee";
import { defaultFetchOptions } from "@/lib/api";
import type { ApiV1TopguildsGetResponse } from "@/typings";

export default async function Topguilds() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/top-guilds`, defaultFetchOptions);
    if (!res.ok) return null;

    const data: ApiV1TopguildsGetResponse = await res.json();

    if (!data || !data.guilds || data.guilds.length === 0) return null;

    const { userCount, guildCount, guilds } = data;

    return (
        <div className="w-full my-16 px-4">
            <div className="items-center text-xl text-zinc-400 mt-[-16rem]">
                Notifying <strong>{userCount.toLocaleString()}</strong> users across <strong>{guildCount.toLocaleString()}</strong> servers
            </div>
            <Marquee fade pauseOnHover>
                {guilds.map((guild) => (
                    <div
                        key={guild.id}
                        className="flex items-center justify-start w-80 h-32 mx-4 bg-zinc-900/40 rounded-2xl p-4 backdrop-blur-sm"
                    >
                        <UserAvatar
                            alt={guild.name}
                            className="w-16 h-16 rounded-full"
                            src={
                                guild.icon
                                    ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=128`
                                    : "/discord.webp"
                            }
                        />
                        <div className="ml-4 flex flex-col justify-end">
                            <div className="flex items-center gap-2 font-semibold text-lg text-white">
                                {guild.name}
                                {guild.verified && (
                                    <HiCheckCircle className="w-5 h-5 text-blue-400" title="Verified Server" />
                                )}
                                {guild.partnered && (
                                    <HiHand className="w-5 h-5 text-purple-400" title="Partnered Server" />
                                )}
                            </div>
                            <div className="text-sm text-zinc-400">
                                {guild.memberCount.toLocaleString()} members
                            </div>
                        </div>
                    </div>
                ))}
            </Marquee>
        </div>
    );
}