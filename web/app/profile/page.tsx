"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useCookies } from "next-client-cookies";
import Searchbar from "@/components/input/searchbar";
import { useApi } from "@/lib/api/hooks";
import type { ApiV1UsersMeGuildsGetResponse } from "@/typings";
import { HomeButton, ScreenMessage, SupportButton } from "@/components/screen-message";
import { HiChartBar, HiRefresh, HiUserAdd, HiViewGridAdd } from "react-icons/hi";
import { cn } from "@/utils/cn";
import { Button } from "@heroui/react";
import ImageReduceMotion from "@/components/ui/reducemotion";
import { useSearchParams } from "next/navigation";

const MAX_GUILDS = 100 as const;

const springAnimation = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.7
        }
    }
} as const;

export default function Home() {
  const [search, setSearch] = useState<string>("");

  const cookies = useCookies();

  const { isLoading, data, error } = useApi<ApiV1UsersMeGuildsGetResponse[]>("/dashboard/@me/guilds");

      const guilds = useMemo(
        () => Array.isArray(data) ? data.sort(sort).filter((guild) => filter(guild, search)).slice(0, MAX_GUILDS) : [],
        [data, search]
    );

        if (error) {
        return (
            <ScreenMessage
                top="10rem"
                title="Something went wrong on this page.."
                description={`${error}`}
                buttons={<>
                    <HomeButton />
                    <SupportButton />
                </>}
            >
            </ScreenMessage>
        );
    }

    if (isLoading || !data) return <></>;

  return (
    <div className="flex flex-col w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative top-2 w-full">
            <Searchbar
            value={search}
            setValue={setSearch}
            placeholder="Search by name"
            thin
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
                <Button
                    as={Link}
                    className="w-1/2 md:w-min"
                    href="/login?invite=true"
                    prefetch={false}
                    startContent={<HiUserAdd />}
                >
                    Add to Server
                </Button>
            <Button
                    as={Link}
                    className="button-primary w-1/2 md:w-min"
                    href="/login"
                    prefetch={false}
                    startContent={<HiRefresh />}
            >
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {!isLoading &&
            <motion.ul
                variants={{
                    hidden: { opacity: 1, scale: 0 },
                    visible: {
                        opacity: 1,
                        scale: 1,
                        transition: {
                            delayChildren: data.length > 20 ? 0.2 : 0.3,
                            staggerChildren: data.length > 20 ? 0.1 : 0.2
                        }
                    }
                }}
                initial={cookies.get("reduceMotions") === "true" ? "visible" : "hidden"}
                animate="visible"
                className="grid grid-cols-1 gap-3.5 w-full mt-3 lg:grid-cols-3 md:grid-cols-2"
            >
                {guilds.map((guild) => <Guild key={"guild-" + guild.id} {...guild} />)}
            </motion.ul>
        }

        {guilds.length > MAX_GUILDS &&
            <ScreenMessage
                title="There are too many servers.."
                description={`To save some performance, use the search to find a guild. Showing ${MAX_GUILDS} out of ~${guilds.length < 1000 ? length : Math.round(length / 1000) * 1000}.`}
            >
            </ScreenMessage>
        }

    </div>);
}

  async function handleRefresh() {
    try {
      useApi<ApiV1UsersMeGuildsGetResponse[]>("/dashboard/@me/guilds?skipcache=true");

    } catch (error) {
      console.error(error);
    }
  }

function sort(a: ApiV1UsersMeGuildsGetResponse, b: ApiV1UsersMeGuildsGetResponse) {
    return a.botInGuild === b.botInGuild
        ? 0
        : (a.botInGuild ? -1 : 1);
}

function filter(guild: ApiV1UsersMeGuildsGetResponse, search: string) {
    if (!search) return true;

    if (guild.name?.toLowerCase().includes(search.toLowerCase())) return true;
    if (search.toLowerCase().includes(guild.name?.toLowerCase())) return true;

    if (guild.id.includes(search)) return true;
    if (search.includes(guild.id)) return true;

    return false;
}

function Guild({ id, name, icon, botInGuild }: ApiV1UsersMeGuildsGetResponse) {
    return (
        <motion.li
            className={cn(
                "dark:bg-flame bg-flame-100 p-3.5 flex items-center rounded-xl drop-shadow-md overflow-hidden relative duration-100 outline-flame-500 hover:outline group/card",
                !botInGuild && "saturate-50 brightness-50"
            )}
            variants={springAnimation}
        >
            <ImageReduceMotion
                alt=""
                className="absolute top-[-48px] left-0 w-full z-0 blur-xl opacity-30 pointer-events-none"
                size={16}
                url={`https://cdn.discordapp.com/icons/${id}/${icon}`}
                forceStatic={true}
            />

            <ImageReduceMotion
                alt={`Server icon of @${name}`}
                className="rounded-lg size-15 z-1 relative drop-shadow-md"
                size={56}
                url={`https://cdn.discordapp.com/icons/${id}/${icon}`}
            />

            <div className="ml-3 text-sm relative bottom-0.5">
                <span className="text-lg dark:text-neutral-200 font-medium text-neutral-800 mb-1 sm:max-w-64 lg:max-w-56 truncate">
                    {name}
                </span>
                <div className="flex gap-1">
                    {botInGuild
                        ? <ManageButton guildId={id} />
                        : <InviteButton guildId={id} />
                    }
                    {botInGuild}
                </div>
            </div>

        </motion.li>
    );
}

function InviteButton({ guildId }: { guildId: string; }) {
    return (
        <Button
            as={Link}
            className="default dark:bg-neutral-500/40 hover:dark:bg-neutral-500/20 bg-neutral-400/40 hover:bg-neutral-400/20 text-sm h-9"
            href={`/login?invite=true&guild_id=${guildId}`}
            prefetch={false}
            startContent={<HiUserAdd />}
        >
            Add NotificationBot
        </Button>
    );
}

function ManageButton({ guildId }: { guildId: string; }) {
    const searchParams = useSearchParams();

    return (
        <Button
            as={Link}
            className="default dark:bg-neutral-500/40 hover:dark:bg-neutral-500/20 bg-neutral-400/40 hover:bg-neutral-400/20 text-sm h-9"
            href={`/dashboard/${guildId}${searchParams.get("to") ? `/${searchParams.get("to")}` : ""}`}
            startContent={<HiViewGridAdd />}
        >
            Manage
        </Button>
    );
}