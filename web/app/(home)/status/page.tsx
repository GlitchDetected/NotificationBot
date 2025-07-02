"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { HiServer } from "react-icons/hi";

import { defaultFetchOptions } from "@/lib/api";
import { useSectionInView } from "@/lib/hooks";

interface StatusData {
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

const Status = () => {
    const { ref } = useSectionInView("Status");

    const [status, setStatus] = useState<StatusData | null>(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API}/status`, {
                    ...defaultFetchOptions
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch status data");
                }

                const data = await res.json();
                setStatus(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchStatus();
    }, []);

    if (error) {
        return <div>Error fetching status: {error}</div>;
    }

    if (!status) {
        return (
            <div className="flex items-center justify-center h-40">
                <Loader2 className="w-12 h-12 animate-spin" />
            </div>
        );
    }

    return (
        <div id="status" ref={ref} className="flex flex-col items-center gap-6">
            <h1 className="text-2xl font-bold from-red-900 to-red-400">NotificationBot Status</h1>

            <div className="card">
                <HiServer className="w-5 h-5" />
                <h3>Bot statistics</h3>
                <p>
                    <strong>Presence:</strong> {status.presence}
                </p>
                <p>
                    <strong>Discord Bot:</strong> {status.discord_bot}
                </p>
                <p>
                    <strong>Uptime:</strong> {status.uptime}
                </p>
                <p>
                    <strong>Guilds:</strong> {status.bot.guilds}
                </p>
                <p>
                    <strong>Users:</strong> {status.bot.users}
                </p>
                <p>
                    <strong>Latency:</strong> {status.bot.latency}ms
                </p>
                <p>
                    <strong>Commands Loaded:</strong> {status.bot.commands_loaded}
                </p>
            </div>

            <div className="card">
                <FaDiscord className="w-5 h-5" />
                <h3>Server Information</h3>
                <p>
                    <strong>Memory Usage:</strong> {status.system.memory_usage} MB
                </p>
                <p>
                    <strong>CPU Usage:</strong> user {status.system.cpu_usage.user}, system {status.system.cpu_usage.system}
                </p>
                <p>
                    <strong>TypeScript:</strong> {status.environment.typescript_version}
                </p>
                <p>
                    <strong>Platform:</strong> {status.environment.platform}
                </p>
                <p>
                    <strong>Processor:</strong> {status.environment.processor}
                </p>
                <p>Source:{status.data_source}</p>
            </div>
        </div>
    );
};

export default Status;