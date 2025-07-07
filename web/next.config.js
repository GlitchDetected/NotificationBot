/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        pathname: '/avatars/**',
      },
            {
                protocol: "https",
                hostname: "cdn.discordapp.com",
                port: "",
                pathname: "/icons/**"
            },
            {
                protocol: "https",
                hostname: "cdn.discordapp.com",
                port: "",
                pathname: "/emojis/**"
            },
                        {
                protocol: "https",
                hostname: "cdn.discordapp.com",
                port: "",
                pathname: "/banners/**"
            },
            {
                protocol: "https",
                hostname: "imageapi.notificationbot.xyz",
                port: "",
                pathname: "/"
            },
                        {
                protocol: "https",
                hostname: "yt3.ggpht.com",
                port: "",
                pathname: "/**"
            },
            {
                protocol: "https",
                hostname: "static-cdn.jtvnw.net",
                port: "",
                pathname: "/jtv_user_pictures/**"
            },
           {
               protocol: "https",
               hostname: "cdn.bsky.app",
               port: "",
               pathname: "/img/avatar/plain/**"
           }
    ],
  },
};

module.exports = (nextConfig);
