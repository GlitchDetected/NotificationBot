"use client";

import Link from "next/link";
import { Suspense, useEffect, useState, useMemo } from "react";
import { ListTab } from "@/components/list-tab";
import { Button, Skeleton } from "@heroui/react";
import Image from "next/image";
import Fallbacklogo from "@/public/images/fallbacklogo.png";
import { guildStore } from "@/common/guildStore";
import { useQuery } from "@tanstack/react-query";
import { cacheOptions, getData } from "@/lib/api";
import { useCookies } from "next-client-cookies";
import { redirect, useParams } from "next/navigation";
import type { ApiV1GuildsChannelsGetResponse, ApiV1GuildsEmojisGetResponse, ApiV1GuildsGetResponse, ApiV1GuildsRolesGetResponse } from "@/typings";
import Head from "next/head";
import { intl } from "@/utils/intl";
import ImageReduceMotion from "@/components/ui/reducemotion";
import { ScreenMessage, SupportButton } from "@/components/screen-message";
import { ClientButton } from "@/components/clientfunc";
import { 
  HiArrowNarrowLeft, HiBell, HiPaperAirplane, 
  HiUsers, HiViewGridAdd, HiRss, HiHome
} 
from "react-icons/hi";

function useGuildData<T extends unknown[]>(
    url: string,
    onLoad: (data: T, error: boolean) => void
) {
const query = useQuery({
    queryKey: [url],
    queryFn: () => getData<T>(url),
    enabled: !!guildStore((g) => g)?.id,
    ...cacheOptions
  });

const { data } = query;

useEffect(() => {
  if (data) {
    const isError = !data || "message" in data;
    onLoad(isError ? ([] as unknown as T) : data, isError);
  }
}, [data]);

return query;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
   const cookies = useCookies();
    const params = useParams();

    const [error, setError] = useState<string>();
    const [loaded, setLoaded] = useState<string[]>([]);

    const guild = guildStore((g) => g);

    const session = useMemo(() => cookies.get("session"), [cookies]);

    // if (!session) redirect(`/login?callback=/dashboard/${params.guildId}`);

    const url = `/guilds/${params.guildId}` as const;

    const { data, isLoading } = useQuery({
        queryKey: [url],
        queryFn: () => getData<ApiV1GuildsGetResponse>(url),
        enabled: !!params.guildId,
            ...cacheOptions,
            refetchOnMount: true
        });

    useGuildData<ApiV1GuildsChannelsGetResponse[]>(
        `${url}/channels`,
        (data) => {
            guildStore.setState({ ...guild, channels: data });
            setLoaded((loaded) => [...loaded, "channels"]);
        }
    );

    useGuildData<ApiV1GuildsRolesGetResponse[]>(
        `${url}/roles`,
        (data) => {
            guildStore.setState({ ...guild, roles: data });
            setLoaded((loaded) => [...loaded, "roles"]);
        }
    );

    useGuildData<ApiV1GuildsEmojisGetResponse[]>(
        `${url}/emojis`,
        (data) => {
            guildStore.setState({ ...guild, emojis: data });
            setLoaded((loaded) => [...loaded, "emojis"]);
        }
    );

    useEffect(() => {
        if (data && "message" in data) {
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
                          <Button
                    as={Link}
                    className="w-fit"
                    href="/profile"
                    startContent={<HiArrowNarrowLeft />}
                >
                    Profile
                </Button>

                <div className="text-lg flex gap-5">
                    <Skeleton isLoaded={!isLoading} className="rounded-full h-14 w-14 ring-offset-[var(--background-rgb)] ring-2 ring-offset-2 ring-red-400/40 shrink-0">
                        <ImageReduceMotion
                            alt="this server"
                            className="rounded-full"
                            url={`https://cdn.discordapp.com/icons/${guild?.id}/${guild?.icon}`}
                            size={128}
                        />
                    </Skeleton>

                    {isLoading ?
                        <div className="mt-1.5">
                            <Skeleton className="rounded-xl w-32 h-6 mb-2" />
                            <Skeleton className="rounded-xl w-10 h-3.5" />
                        </div>
                        :
                        <div className="flex flex-col gap-1">
                            <div className="text-2xl dark:text-neutral-200 text-neutral-800 font-medium">{guild?.name || "Unknown Server"}</div>
                            <div className="text-sm font-semibold flex items-center gap-1"> <HiUsers /> {intl.format(guild?.memberCount || 0)}</div>
                        </div>
                    }

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
                            name: "Third Party Notifications",
                            value: "/tpa",
                            icon: <HiBell />
                        },
                        {
                            name: "Webhook",
                            value: "/webhook",
                            icon: <HiPaperAirplane className="rotate-45" />
                        },
                        {
                            name: "Feed Notifications",
                            value: "/feednotifications",
                            icon: <HiRss />
                        }
                    ]}
                    url={`/dashboard/${params.guildId}`}
                    disabled={!guild || !!error}
                />
            </Suspense>

                  {error ?
                <ScreenMessage
                    title={error.includes("permssions")
                        ? "You cannot access this page.."
                        : "Something went wrong on this page.."
                    }
                    description={error}
                    buttons={<>
                        <ClientButton
                            as={Link}
                            href="/profile"
                            startContent={<HiViewGridAdd />}
                        >
                            Go back to Dashboard
                        </ClientButton>
                        <SupportButton />
                    </>}
                >
                </ScreenMessage>
                :
                (guild && loaded.length === 3) ? children : <></>
            }
    </div>
  );
}
