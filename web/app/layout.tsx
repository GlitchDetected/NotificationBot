import "./globals.css";

import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { CookiesProvider } from "next-client-cookies/server";

import Notice, { NoticeType } from "@/components/notice";
import { LoginButton } from "@/components/ui/login-button";
import { LoginHeader } from "@/components/ui/nav-header";
import { cn } from "@/utils/cn";
import { notosans, outfit } from "@/utils/font";
import { getBaseUrl } from "@/utils/urls";

import { Provider } from "./provider";

export const viewport: Viewport = {
    themeColor: "#5e0202",
    initialScale: 0.85
};

export const generateMetadata = (): Metadata => {
    const title = "NotificationBot - Next Generation of Notifications";
    const description =
        "Setup notifications from your favorite platforms in a haste without slash commands!";

    return {
        metadataBase: new URL(getBaseUrl()),

        manifest: "/manifest.json",
        appleWebApp: {
            capable: true,
            title: "NotificationBot",
            startupImage: "/bot.webp",
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
                template: "NotificationBot Dashboard | %s"
            },
            description,
            type: "website",
            url: getBaseUrl(),
            images: `${getBaseUrl()}/bot.webp`
        },
        twitter: {
            card: "summary",
            site: "notificationbot.top",
            title,
            description,
            images: `${getBaseUrl()}/bot.webp`
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
                        "w-full max-w-7xl overflow-x-hidden xl:overflow-visible!",
                        outfit.variable,
                        notosans.variable
                    )}
                    style={{ overflow: "visible" }}
                >
                    <div id="bg" className="absolute top-0 right-0 w-screen h-screen -z-50" />
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

async function NavBar({ className }: { className?: string; }) {
    const jar = await cookies();

    interface Linktypes {
        name: string;
        hash: string;
    }

    const links: Linktypes[] = [
        { name: "Status", hash: "/status" },
        { name: "Commands", hash: "/commands" },
        { name: "Documentation", hash: "/docs/home" }
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 left-1/2 -translate-x-1/2",
                "relative flex items-center justify-between",
                "w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[75%]",
                "h-12 sm:h-14 lg:h-16",
                "sm:top-4 z-999",
                "px-3 sm:px-5 md:px-8",
                "rounded-lg sm:rounded-xl",
                "shadow-sm shadow-gray-700/50",
                "bg-foreground/60 backdrop-blur-md backdrop-brightness-75",
                className
            )}
        >

            <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/bot.webp"
                        alt="Logo"
                        width={30}
                        height={30}
                        className="sm:w-9 sm:h-9 md:w-10 md:h-10"
                    />
                    <span className="hidden xs:inline text-sm sm:text-base font-semibold tracking-wide">
                        NotificationBot
                    </span>
                </Link>
            </div>

            <ul
                className="absolute left-1/2 -translate-x-1/2 flex justify-center gap-3 sm:gap-5 md:gap-6 text-[0.8rem] sm:text-[0.9rem] md:text-[1rem] font-medium"
            >
                {links.map((link) => (
                    <Link
                        key={link.hash}
                        className="px-2 py-1 transition hover:text-red-600"
                        href={link.hash}
                    >
                        {link.name}
                    </Link>
                ))}
            </ul>

            <div className="flex ml-auto">
                {jar.get("sessiontoken")?.value ? (
                    <LoginHeader />
                ) : (
                    <LoginButton className="ml-auto text-sm sm:text-base" />
                )}
            </div>
        </nav>
    );
}