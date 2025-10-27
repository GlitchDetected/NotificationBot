import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "cdn.discordapp.com", pathname: "/**" },
            { protocol: "https", hostname: "images.notificationbot.top", pathname: "/**" },
            { protocol: "https", hostname: "yt3.ggpht.com", pathname: "/**" },
            { protocol: "https", hostname: "static-cdn.jtvnw.net", pathname: "/**" },
            { protocol: "https", hostname: "cdn.bsky.app", pathname: "/**" },
            { protocol: "https", hostname: "www.redditstatic.com", pathname: "/**" },
            { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/**" },
            { protocol: "https", hostname: "github.com", pathname: "/**" },
            { protocol: "http", hostname: "localhost", port: "5000", pathname: "/**" }
        ]
    }
};

export default withSentryConfig(
    nextConfig,
    {
        org: "random-development",
        project: "notificationbotweb",
        silent: !process.env.CI,
        widenClientFileUpload: true,
        disableLogger: true,
        automaticVercelMonitors: true
    }
);