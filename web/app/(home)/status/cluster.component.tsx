import Image from "next/image";
import { HiLightningBolt } from "react-icons/hi";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import { intl } from "@/utils/intl";

import type { ApiCluster } from "./api";

export function Cluster(cluster: ApiCluster) {
    return (
        <div
            className="w-full md:flex gap-4 space-y-2 md:space-y-0 justify-between items-center p-4 bg-foreground rounded-lg outline-red-400 duration-200 h-min"
            id={"cluster-" + cluster.id}
        >
            <div className="sm:flex items-center w-1/6">
                <div className="flex gap-1 items-center">
                    <Icon theping={cluster.ping} />
                    <span className="text-neutral-100 text-lg font-medium">
                        {cluster.name}
                    </span>

                    <span className="text-neutral-300">
                        #{cluster.id}
                    </span>
                </div>
            </div>

            <div className="md:flex w-2/3 justify-between text-primary-foreground">
                <div className="md:w-1/4">
                    <span className="text-muted-foreground mr-1 text-xs">Uptime:</span>
                    {cluster.uptime}
                </div>
                <div className="md:w-1/4">
                    <span className="text-muted-foreground mr-1 text-xs">Memory:</span>
                    {intl.format(cluster.memory)}mb
                </div>
                <div className="md:w-1/4">
                    <span className="text-muted-foreground mr-1 text-xs">Users:</span>
                    {intl.format(cluster.users)}
                </div>
                <div className="md:w-1/5">
                    <span className="text-muted-foreground mr-1 text-xs">Guilds:</span>
                    {intl.format(cluster.guilds)}
                </div>
            </div>

            <Badge
                className={cn(cluster.ping > 0 && "text-neutral-400 bg-foreground max-w-1/6")}
                variant={cluster.ping < 0 ? "destructive" : "default"}
                radius="rounded"
            >
                <HiLightningBolt />
                {cluster.ping}ms
            </Badge>
        </div>
    );
}

function Icon({ theping }: { theping: number; }) {
    const emoteId = theping > 0
        ? "1424866580902449192"
        : "1424866580902449192";

    return (
        <Image
            alt="online"
            className="size-7"
            src={`https://cdn.discordapp.com/emojis/${emoteId}.webp?size=32&quality=lossless`}
            width={32}
            height={32}
        />
    );
}