const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID!;
const TWITCH_APP_ACCESS_TOKEN = process.env.TWITCH_APP_ACCESS_TOKEN!;

export async function getTwitchUserInfo(username: string): Promise<{ id: string; avatarUrl: string } | null> {
  try {
    const res = await fetch(`https://api.twitch.tv/helix/users?login=${encodeURIComponent(username)}`, {
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${TWITCH_APP_ACCESS_TOKEN}`,
      },
    });
    const data = await res.json();

    if (data.data && data.data.length > 0) {
      const user = data.data[0];
      return {
        id: user.id,
        avatarUrl: user.profile_image_url,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching Twitch user info:", error);
    return null;
  }
}