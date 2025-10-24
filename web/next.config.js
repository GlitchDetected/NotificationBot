/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true
    },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.discordapp.com', pathname: '/avatars/**' },
      { protocol: 'https', hostname: 'cdn.discordapp.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'imageapi.notificationbot.top', port: '', pathname: '/' },
      { protocol: 'https', hostname: 'yt3.ggpht.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'static-cdn.jtvnw.net', port: '', pathname: '/jtv_user_pictures/**' },
      { protocol: 'https', hostname: 'cdn.bsky.app', port: '', pathname: '/img/avatar/plain/**' },
      { protocol: 'https', hostname: 'www.redditstatic.com', port: '', pathname: '/avatars/**' },
      { protocol: 'https', hostname: 'upload.wikimedia.org', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.bsky.app', port: '', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', port: '5000', pathname: '/**' },
    ],
  },
};

module.exports = nextConfig;

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    org: "random-development",
    project: "notificationbotweb",
    silent: !process.env.CI,
    widenClientFileUpload: true,
    disableLogger: true,
    automaticVercelMonitors: true,
  }
);