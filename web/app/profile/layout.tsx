"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { ListTab } from "@/components/list";
import { Button, Skeleton } from "@heroui/react";
import { useParams, usePathname } from "next/navigation";
import { getCanonicalUrl } from "@/lib/urls";
import { HiSpeakerphone, HiHome } from "react-icons/hi";
import Image from "next/image";
import { Loader2, RefreshCcw, Search, LayoutDashboard, CircleUser } from "lucide-react";

const NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API;
const SIGNIN_URL = `${NEXT_PUBLIC_API}/auth/signin`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="flex flex-col w-full p-25">
      <title>Your Profile</title>

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

      {/* Children (Content) */}
      <div>{!loading && user ? children : <Skeleton />}</div>
    </div>
  );
}
