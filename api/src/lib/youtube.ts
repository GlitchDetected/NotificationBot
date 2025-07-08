export default async function getYouTubeAvatar(creatorId: string): Promise<string | null> {
    try {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${creatorId}&key=${process.env.YTV3API}`);
        const data = await res.json();
        return data?.items?.[0]?.snippet?.thumbnails?.high?.url ?? null;
    } catch {
        return null;
    }
}

export async function getYtChannelId(creatorHandle: string): Promise<string | null> {
    try {
        const query = encodeURIComponent(creatorHandle);
        const res = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${query}&key=${process.env.YTV3API}`
        );
        const data = await res.json();
        return data?.items?.[0]?.snippet?.channelId ?? null;
    } catch {
        return null;
    }
}