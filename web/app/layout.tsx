import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Outfit } from "next/font/google";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { CookiesProvider } from "next-client-cookies/server";

import Notice, { NoticeType } from "@/components/notice";
import { LoginButton } from "@/components/ui/loginbutton";
import { LoginHeader } from "@/components/ui/loginheader";
import { ActiveSectionContextProvider } from "@/lib/active-section-context";
import { links } from "@/lib/data";
import { cn } from "@/utils/cn";
import { getBaseUrl } from "@/utils/urls";

import { Provider } from "./provider";

const outfit = Outfit({ subsets: ["latin", "latin-ext"], variable: "--font-outfit" });
const notosansJP = Noto_Sans_JP({ subsets: ["cyrillic", "vietnamese"], variable: "--font-noto-sans-jp" });

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
            startupImage: "/images/notificationbot256.webp",
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
            images: `${getBaseUrl()}/images/notificationbot256.webp`
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
                className="dark flex justify-center max-w-screen overflow-x-hidden"
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
                    <div className="absolute top-0 right-0 w-screen h-screen -z-50" />
                    {/* <Noise /> */}
                    <NoScript />
                    <ActiveSectionContextProvider>
                        <NavBar />
                        <Provider>{children}</Provider>
                    </ActiveSectionContextProvider>
                </body>
            </html>
        </CookiesProvider>
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
            className="fixed top-0 left-1/2 transform -translate-x-1/2 h-[4.5rem]
      w-full rounded-none border-opacity-40 sm:rounded-lg flex items-center px-10
      md:px-15 lg:px-20 justify-between bg-white shadow-md dark:bg-red-950 dark:shadow-black/90
      z-[999] sm:top-6 sm:h-[4rem] sm:w-[55rem]"
        >
            <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/images/notificationbot_transparent.png" alt="Logo" width={50} height={50} />
                    <span className="text-lg font-semibold">NotificationBot</span>
                </Link>
            </div>

            <ul className="hidden md:flex flex-1 items-center justify-center gap-8 text-[0.9rem] font-medium text-gray-500 dark:text-gray-400">
                {links.map((link) => (
                    <Link
                        key={link.hash}
                        className="px-3 py-2 hover:text-gray-950 dark:hover:text-gray-300 transition"
                        href={link.hash}
                    >
                        {link.name}
                    </Link>
                ))}
            </ul>

            {jar.get("sessiontoken")?.value ? <LoginHeader /> : <LoginButton className="ml-auto" />}
        </nav>
    );
}