import "./globals.css";

import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { CookiesProvider } from "next-client-cookies/server";

import Notice, { NoticeType } from "@/components/notice";
import { LoginButton } from "@/components/ui/loginbutton";
import { LoginHeader } from "@/components/ui/loginheader";
import { links } from "@/lib/data";
import { cn } from "@/utils/cn";
import { notosansJP, outfit } from "@/utils/font";
import { getBaseUrl } from "@/utils/urls";

import { Provider } from "./provider";

export const viewport: Viewport = {
    themeColor: "#1c1c1c",
    initialScale: 0.85
};

export const generateMetadata = (): Metadata => {
    const title = "NotificationBot - notifications for everything";
    const description =
    "Engage with leaderboards, levels, and more! Have fun with commands like /rank, /leaderboard and protect your server with /lockdown!";

    return {
        metadataBase: new URL(getBaseUrl()),

        manifest: "/manifest.json",
        appleWebApp: {
            capable: true,
            title: "NotificationBot",
            startupImage: "/me.webp",
            statusBarStyle: "black-translucent"
        },

        title: {
            default: title,
            template: "%s"
        },

        description,
        keywords: ["discord", "bot"],

        alternates: {
            canonical: getBaseUrl()
        },

        openGraph: {
            title: {
                default: title,
                template: "%s on NotificationBot Dashboard"
            },
            description,
            type: "website",
            url: getBaseUrl(),
            images: `${getBaseUrl()}/me.webp`
        },
        twitter: {
            card: "summary",
            site: "notificationbot.xyz",
            title,
            description,
            images: `${getBaseUrl()}/me.webp`
        },

        other: {
            google: "notranslate"
        },

        creator: "GlitchDetected",
        publisher: "GlitchDetected",

        robots: "index, follow"
    };
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
    return (
        <CookiesProvider>
            <html
                suppressHydrationWarning
                data-theme="dark"
                lang="en"
                className="dark dark:text-white text-white flex justify-center max-w-screen overflow-x-hidden"
            >
                <link rel="icon" href="/icons/favicon.ico" sizes="any" />
                <body
                    className={cn(
                        "w-full max-w-7xl overflow-x-hidden xl:!overflow-visible",
                        outfit.variable,
                        notosansJP.variable
                    )}
                    style={{ overflow: "visible" }}
                >
                    <div id="bg" className="absolute top-0 right-0 w-screen h-screen -z-50" />
                    <Noise />
                    <NoScript />
                    <NavBar />
                    <Provider>
                        {children}
                    </Provider>
                </body>
            </html>
        </CookiesProvider>
    );
}

function Noise() {
    return (
        <svg
            className="absolute top-0 left-0 w-screen h-full -z-40 blur-[1px] saturate-0"
            viewBox='0 0 142 158'
            xmlns='http://www.w3.org/2000/svg'
        >
            <filter id='noiseFilter'>
                <feTurbulence
                    type="fractalNoise"
                    baseFrequency="9"
                    numOctaves="1"
                    stitchTiles="stitch"
                    result="turbulence"

                />
                <feComponentTransfer>
                    <feFuncR type="table" tableValues="0 1" />
                    <feFuncG type="table" tableValues="-0" />
                    <feFuncB type="table" tableValues="0" />
                </feComponentTransfer>
            </filter>

            <rect
                className="w-screen h-screen"
                filter='url(#noiseFilter)'
            />
        </svg>
    );
}

function NoScript() {
    return (
        <noscript className="p-4 pb-0 flex">
            <Notice
                className="mb-0"
                message="This site needs JavaScript to work - Please either enable JavaScript or update to a supported Browser."
                type={NoticeType.Info}
            />
        </noscript>
    );
}

async function NavBar() {
    const jar = await cookies();

    return (
        <nav
            className="fixed top-0 left-1/2 transform -translate-x-1/2
                w-full sm:w-[55rem] h-[4.5rem] sm:h-[4rem]
                sm:top-6 z-[999]
                flex items-center justify-between
                px-6 sm:px-10 lg:px-20
                rounded-none sm:rounded-xl
                shadow-xl shadow-black/90
                bg-red-950/40 backdrop-blur-xs backdrop-brightness-75"
        >
            <div className="flex gap-4 items-center">
                <Link href="/" className="flex items-center gap-1">
                    <Image src="/notificationbot_transparent.png" alt="Logo" width={50} height={50} />
                    <span className="text-lg font-semibold">NotificationBot</span>
                </Link>
            </div>

            <ul className="flex-5 gap-8 text-[0.9rem] font-medium">
                {links.map((link) => (
                    <Link
                        key={link.hash}
                        className="px-3 py-2 transition"
                        href={link.hash}
                    >
                        {link.name}
                    </Link>
                ))}
            </ul>

            {jar.get("sessiontoken")?.value
                ? <LoginHeader />
                : <LoginButton
                    className="ml-auto" />}
        </nav>
    );
}