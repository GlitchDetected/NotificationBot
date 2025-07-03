import { defaultFetchOptions } from "@/lib/api";
import type { ApiError } from "@/typings";

export interface ApiCluster {
    id: number;
    name: string;
    ping: number;
    uptime: string;
    memory: number;
    guilds: number;
    users: number;
}

export interface ApiNode {
    id: string;
    uptime: string;
    memory: number;
    usage: number;
    players: number;
}

interface ServerInfo {
    presence: string;
    discord_bot: string;
    bot: {
        guilds: number;
        users: number;
        latency: number;
        commands_loaded: number;
    };
    system: {
        cpu_usage: {
            user: number;
            system: number;
        };
        memory_usage: number;
    };
    uptime: string;
    environment: {
        typescript_version: string;
        platform: string;
        processor: string;
    };
    data_source: string;
}

export interface ApiV1StatusGetResponse {
    clusters: ApiCluster[];
    nodes: ApiNode[];
    serverinfo: ServerInfo[];
}

export async function getStatus(): Promise<ApiV1StatusGetResponse | ApiError | undefined> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/status`,
        {
            ...defaultFetchOptions,
            next: { revalidate: 60 }
        }
    );

    return res.json();
}