export async function getYtChannelId(creatorHandle: string): Promise<string | null> {
    try {
        const query = encodeURIComponent(creatorHandle);
        const res = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${query}&key=${process.env.YTV3API}`
        );
        const data = await res.json();
        return data?.items?.[0]?.id?.channelId ?? null;
    } catch {
        return null;
    }
}