import { UserAvatar } from "@/components/ui/avatar";
import { Marquee } from "@/components/ui/marquee";
import { defaultFetchOptions } from "@/lib/api";
import type { ApiV1TopguildsGetResponse } from "@/typings";

export default async function Topguilds() {
    const topGuilds = await fetch(`${process.env.NEXT_PUBLIC_API}/top-guilds`, defaultFetchOptions)
        .then((res) => res.json())
        .catch(() => null) as ApiV1TopguildsGetResponse[] | null;

    if (!topGuilds || topGuilds.length === 0) return null;

    return (
        <Marquee
            direction="left"
            fade={true}
            pauseOnHover={true}
            className="[--duration:5s]"
        >
            {topGuilds.map((guild) => (
                <div key={guild.id} className="flex flex-col items-center justify-center w-64 h-48 mx-4">
                    <UserAvatar
                        alt={guild.name}
                        className="w-16 h-16 rounded-full mb-2"
                        src={guild.icon ? `${guild.icon}?size=128` : "/discord.webp"}
                    />
                    <div className="text-center font-semibold text-lg">{guild.name}</div>
                    <div className="text-center text-sm text-zinc-400">
                        {guild.memberCount.toLocaleString()} members
                    </div>
                </div>
            ))}
        </Marquee>
    );
}