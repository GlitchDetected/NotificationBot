import "@dotenvx/dotenvx/config";

// export config as a constant value
export default {
    client: {
        token: String(process.env["DISCORD_TOKEN"]),
        clientId: String(process.env["DISCORD_CLIENT_ID"]),
        clientSecret: String(process.env["DISCORD_CLIENT_SECRET"])
    },

    apiSecrets: {
        botApiSecret: String(process.env["API_SECRET"]),
        jwtSecret: String(process.env["JWT_SECRET"]),
        youtubeAPI: String(process.env["YTV3API"])
    },

    databaseUri: String(process.env["pgConnectionString"]),
    redisString: String(process.env["REDIS_STRING"]),
    discordEndpoint: String(process.env["DISCORD_ENDPOINT"]),

    api: {
        apiPort: Number(process.env["PORT"]) || 3001,
        api_url: String(process.env["API_URL"])
    },
    dashboard: String(process.env["DASHBOARD_URL"]),

    integrations: {
        ...process.env["webhook"] && { webhook: process.env["webhook"] }
    }
} as const;