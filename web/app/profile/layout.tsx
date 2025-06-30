"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { ListTab } from "@/components/list";
import { Skeleton } from "@heroui/react";
import { HiSpeakerphone, HiHome } from "react-icons/hi";
import Image from "next/image";
import { CircleUser } from "lucide-react";

import { userStore } from "@/common/userStore";
import { useQuery } from "@tanstack/react-query";
import { cacheOptions, getData } from "@/lib/api";
import { HomeButton, ScreenMessage, SupportButton } from "@/components/screen-message";
import { useCookies } from "next-client-cookies";
import { redirect } from "next/navigation";
import type { ApiV1UsersMeGetResponse } from "@/typings";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  const cookies = useCookies();
  const session = cookies.get("sessiontoken");

  if (!session) redirect("/login?callback=/profile");

    const user = userStore((u) => u);

    const url = "/dashboard/@me" as const;

    const { data, error } = useQuery({
        queryKey: [url],
        queryFn: () => getData<ApiV1UsersMeGetResponse>(url),
        enabled: !!user?.id,
        ...cacheOptions
    });

    useEffect(() => {
        if (data && !("message" in data)) {
            userStore.setState({
                ...user,
                extended: "status" in data ? {} : data
            });
        }
    }, [data, user]);

    if (error || (data && "message" in data)) {
        return (
            <ScreenMessage
                title="Something went wrong on this page.."
                description={
                    (data && "message" in data ? data.message : `${error}`)
                    || "An unknown error occurred."}
                buttons={<>
                    <HomeButton />
                    <SupportButton />
                </>}
            >
            </ScreenMessage>
        );
    }

  return (
    <div className="flex flex-col w-full p-25">
      <title>NotificationBot Profile</title>

      {/* User Info Section */}
      {user && (
        <div className="flex items-center mb-1 gap-4">
          {user.avatarHash ? (
            <Image
              src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatarHash}.webp?size=128`}
              alt="User Avatar"
              width={50}
              height={50}
              className="rounded-full cursor-pointer border-2 border-gray-600"
              priority
            />
          ) : (
            <CircleUser className="w-10 h-10" />
          )}
          <div>
            <div className="text-xs text-gray-400">{user.displayName || "No Display Name"}</div>
            <div className="font-semibold text-sm">{user.username}</div>
          </div>
        </div>
      )}

      {/* Tabs Section */}
      <Suspense fallback={<Skeleton />}>
        <ListTab
          tabs={[
            { name: "Overview", value: "/", icon: <HiHome /> },
            { name: "DM Notifications", value: "/dmnotifications", icon: <HiSpeakerphone /> }
          ]}
          url={`/profile`}
          disabled={!user?.id}
        />
      </Suspense>

      {user?.id ? children : <></>}
    </div>
  );
}
