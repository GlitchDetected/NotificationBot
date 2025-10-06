import "./globals.css";

import type { Metadata, Viewport } from "next";
import { CookiesProvider } from "next-client-cookies/server";

import NavBar from "@/components/navbar";
import Notice, { NoticeType } from "@/components/notice";
import { cn } from "@/utils/cn";
import { notosansJP, outfit } from "@/utils/font";
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
                template: "%s on NotificationBot Dashboard"
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
                        "w-full max-w-7xl overflow-x-hidden xl:!overflow-visible",
                        outfit.variable,
                        notosansJP.variable
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