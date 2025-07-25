import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getCanonicalUrl } from "@/utils/urls";

export const generateMetadata = (): Metadata => {
    const title = "Login with Discord";
    const description = "Start notifying now with NotificationBot!!!";
    const url = getCanonicalUrl("login");

    return {
        title,
        description,
        alternates: {
            canonical: url
        },
        openGraph: {
            title,
            description,
            url: `https://discord.com/api/v9/applications/${process.env.CLIENT_ID}/og.png`,
            type: "website",
            images: {
                url,
                width: 1200,
                height: 630,
                type: "image/png"
            }
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: {
                url: `https://discord.com/api/v9/applications/${process.env.CLIENT_ID}/og.png`,
                alt: title
            }
        }
    };
};

export default async function Home() {
    if (!(await headers()).get("user-agent")?.includes("Discordbot/2.0")) redirect("/login");
    return <></>;
}