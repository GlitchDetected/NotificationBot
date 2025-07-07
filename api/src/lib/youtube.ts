export default async function getYouTubeAvatar(channelId: string): Promise<string | null> {
  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${process.env.YTV3API}`);
    const data = await res.json();
    return data?.items?.[0]?.snippet?.thumbnails?.high?.url ?? null;
  } catch (error) {
    return null;
  }
}