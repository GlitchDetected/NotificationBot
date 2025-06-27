"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { ListTab } from "@/components/list";
import { Button, Skeleton } from "@heroui/react";
import { useParams, usePathname } from "next/navigation";
import { getCanonicalUrl } from "@/lib/urls";
import { HiArrowNarrowLeft, HiChartBar, HiHome, HiShare, HiUserAdd, HiCursorClick, HiRss } from "react-icons/hi";
import Image from "next/image";
import { CopyToClipboardButton } from "@/components/ctc";
import Fallbacklogo from "@/public/images/fallbacklogo.png";

const NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API;
const SIGNIN_URL = `${NEXT_PUBLIC_API}/auth/signin`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { guildId } = useParams();
  const [guild, setGuild] = useState<any>(null);
  const path = usePathname();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Fetch user data
        const userRes = await fetch(`${NEXT_PUBLIC_API}/dashboard/@me`, { credentials: "include" });
        if (!userRes.ok) {
          if (userRes.status === 401) window.location.href = SIGNIN_URL;
          throw new Error("Failed to fetch user data");
        }
        const userData = await userRes.json();
        setUser(userData.dataValues);

        // Fetch guild data
        const res = await fetch(`${NEXT_PUBLIC_API}/dashboard/@me/guilds`, {
          credentials: "include"
        });

        if (!res.ok) {
          throw new Error("An error occurred");
        }

        const guilds = await res.json();
        const selectedGuild = guilds.find((guild) => guild.id === guildId);

        if (selectedGuild) {
          setGuild(selectedGuild);
        } else {
          console.error("Guild not found");
        }
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    })();
  }, [guildId]);

  return (
    <div className="flex flex-col w-full pt-20 px-4">
      <title>{`${guild?.name}'s Dashboard`}</title>

      <div className="flex flex-col gap-5 mb-3">
        <div className="flex gap-2">
          <Button as={Link} className="w-fit" href="/profile" startContent={<HiArrowNarrowLeft />}>
            Profile
          </Button>
          <CopyToClipboardButton
            text={getCanonicalUrl("leaderboard", guildId.toString())}
            items={[
              {
                icon: <HiShare />,
                name: "Copy page URL",
                description: "Creates a link to this page",
                text: getCanonicalUrl(...path.split("/").slice(1))
              },
              {
                icon: <HiCursorClick />,
                name: "Copy dash-to URL",
                description: "Creates a dash-to link to the current tab",
                text: getCanonicalUrl(`dashboard?to=${path.split("/dashboard/")[1]?.split("/")[1] || "/"}`)
              }
            ]}
            icon={<HiShare />}
          />
        </div>

        <div className="flex items-center space-x-4">
          <Image
            src={
              guild?.icon ? `https://cdn.discordapp.com/icons/${guild?.id}/${guild?.icon}.webp?size=128` : Fallbacklogo
            }
            alt={guild?.name || "Guild Icon"}
            className="w-14 h-14 rounded-full"
            width={128}
            height={128}
            priority
          />
          {loading ? (
            <div className="mt-1.5">
              <Skeleton className="rounded-xl w-32 h-6 mb-2" />
              <Skeleton className="rounded-xl w-10 h-3.5" />
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <div className="text-3xl font-semibold">{guild?.name || "Unknown Server"}</div>
            </div>
          )}
        </div>
      </div>

      <Suspense>
        <ListTab
          tabs={[
            { name: "Overview", value: "/", icon: <HiHome /> },
            { name: "Third Party Notifications", value: "/tpa", icon: <HiChartBar /> },
            { name: "Custom Announcement", value: "/webhook", icon: <HiUserAdd /> },
            { name: "Feed Notifications", value: "/feednotifications", icon: <HiRss /> }
          ]}
          url={`/dashboard/${guildId}`}
          disabled={!guild}
        />
      </Suspense>

      <div className="mt-4">{guild && !loading ? children : <></>}</div>
    </div>
  );
}
