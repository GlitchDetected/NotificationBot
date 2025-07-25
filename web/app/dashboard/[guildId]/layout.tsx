"use client";

import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { HiBell, HiEmojiHappy, HiHome, HiPaperAirplane, HiUsers, HiViewGridAdd } from "react-icons/hi";

import { guildStore } from "@/common/guildStore";
import { ClientButton } from "@/components/client-ui";
import { ListTab } from "@/components/list-tab";
import { ScreenMessage, SupportButton } from "@/components/screen-message";
import ImageReduceMotion from "@/components/ui/reducemotion";
import { Skeleton } from "@/components/ui/skeleton";
import { cacheOptions, getData } from "@/lib/api";
import type {
    ApiV1GuildsChannelsGetResponse,
    ApiV1GuildsEmojisGetResponse,
    ApiV1GuildsGetResponse,
    ApiV1GuildsRolesGetResponse
} from "@/typings";
import { intl } from "@/utils/intl";

function useGuildData<T extends unknown[]>(
    url: string,
    onLoad: (data: T, error: boolean)
    => void
) {
    const query = useQuery({
        queryKey: [url],
        queryFn: () => getData<T>(url),
        enabled: !!guildStore((g) => g)?.id,
        ...cacheOptions
    });

    const { data, isError } = query;

    useEffect(() => {
        const isDataError = !data || "message" in (data as object);

        if (data || isError) {
            onLoad(isDataError ? ([] as unknown as T) : (data as T), isDataError);
        }
    }, [data, isError]);
}

export default function RootLayout({ children }: { children: React.ReactNode; }) {
    const params = useParams();
    const [error, setError] = useState<string>();
    const [loaded, setLoaded] = useState<string[]>([]);

    const guild = guildStore((g) => g);

    // const cookies = useCookies();
    // const session = useMemo(() => cookies.get("session"), [cookies]);
    // if (!session) redirect(`/login?callback=/dashboard/${params.guildId}`);

    const url = `/guilds/${params.guildId}` as const;

    const { data, isLoading } = useQuery({
        queryKey: [url],
        queryFn: () => getData<ApiV1GuildsGetResponse>(url),
        enabled: !!params.guildId,
        ...cacheOptions,
        refetchOnMount: true
    });

    useGuildData<ApiV1GuildsChannelsGetResponse[]>(`${url}/channels`, (data) => {
        guildStore.setState({ ...guild, channels: data });
        setLoaded((loaded) => [...loaded, "channels"]);
    });

    useGuildData<ApiV1GuildsRolesGetResponse[]>(`${url}/roles`, (data) => {
        guildStore.setState({ ...guild, roles: data });
        setLoaded((loaded) => [...loaded, "roles"]);
    });

    useGuildData<ApiV1GuildsEmojisGetResponse[]>(`${url}/emojis`, (data) => {
        guildStore.setState({ ...guild, emojis: data });
        setLoaded((loaded) => [...loaded, "emojis"]);
    });

    useEffect(() => {
        if (!data) return;

        if ("message" in data) {
            setError(data?.message);
            return;
        }

        guildStore.setState(data);
    }, [data]);

    return (
        <div className="flex flex-col w-full">
            {guild?.name && (
                <Head>
                    <title>{`${guild?.name}'s Dashboard`}</title>
                </Head>
            )}

            <div className="flex flex-col gap-5 mb-6">

                <div className="text-lg flex gap-5">
                    <Skeleton
                        className="rounded-full h-14 w-14 ring-offset-[var(--background-rgb)] ring-2 ring-offset-2 ring-red-400/40 shrink-0"
                    >
                        <ImageReduceMotion
                            alt="Random Server"
                            className="rounded-full"
                            url={`https://cdn.discordapp.com/icons/${guild?.id}/${guild?.icon}`}
                            size={128}
                        />
                    </Skeleton>

                    {isLoading ? (
                        <div className="mt-1.5">
                            <Skeleton className="rounded-xl w-32 h-6 mb-2" />
                            <Skeleton className="rounded-xl w-10 h-3.5" />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            <div className="text-2xl dark:text-neutral-200 text-neutral-800 font-medium">
                                {guild?.name || "Unknown Server"}
                            </div>
                            <div className="text-sm font-semibold flex items-center gap-1">
                                {" "}
                                <HiUsers /> {intl.format(guild?.memberCount || 0)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Suspense>
                <ListTab
                    tabs={[
                        {
                            name: "Overview",
                            value: "/",
                            icon: <HiHome />
                        },
                        {
                            name: "Notifications",
                            value: "/notifications",
                            icon: <HiBell />
                        },
                        {
                            name: "Welcomer",
                            value: "/welcomer",
                            icon: <HiEmojiHappy />
                        },
                        {
                            name: "Webhook",
                            value: "/webhook",
                            icon: <HiPaperAirplane className="rotate-45" />
                        }
                    ]}
                    url={`/dashboard/${params.guildId}`}
                    disabled={!guild || !!error}
                />
            </Suspense>

            {error ?
                <ScreenMessage
                    href="/profile"
                    title={error.includes("permissions")
                        ? "You cannot access this page.."
                        : "Something went wrong on this page.."
                    }
                    description={error}
                    buttons={<>
                        <ClientButton>
                            <Link href="/profile" className="flex items-center gap-2">
                                <HiViewGridAdd />
                                Go back to Dashboard
                            </Link>
                        </ClientButton>
                        <SupportButton />
                    </>}
                >
                </ScreenMessage>
                :
                // Only render children if the guild data exists and channels, roles, emojis have been loaded.
                // Otherwise, render nothing to wait for data to be ready.
                (guild && loaded.length === 3) ? children : <></>
            }

        </div>
    );
}