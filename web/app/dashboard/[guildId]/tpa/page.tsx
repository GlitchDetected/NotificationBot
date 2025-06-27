"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API;

interface Tpa {
  guildId: string;

  youtubeDiscordChannelId: string | null;
  youtubeChannelUrl: string | null;

  tiktokDiscordChannelId: string | null;
  tiktokChannelUrl: string | null;

  twitchDiscordChannelId: string | null;
  twitchChannelUrl: string | null;
}

interface Channel {
  id: string;
  name: string;
}

export default function TpaPage() {
  const { guildId } = useParams();
  const router = useRouter();
  const [config, setConfig] = useState<Tpa | null>(null);
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);

  const [youtubeDiscordChannel, setYoutubeDiscordChannel] = useState("");
  const [tiktokDiscordChannel, setTiktokDiscordChannel] = useState("");
  const [twitchDiscordChannel, setTwitchDiscordChannel] = useState("");

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [twitchUrl, setTwitchUrl] = useState("");

  const params = useParams();

  const [channels, setChannels] = useState<Channel[]>([]);

  const url = `/guilds/${params.guildId}/tpa` as const;

  useEffect(() => {
    if (!guildId) return;

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${NEXT_PUBLIC_API}/dashboard/thirdpartyannouncements?guildId=${guildId}`, {
          credentials: "include"
        });
        if (res.ok) {
          const data = await res.json();
          setConfig(data.config);
          setEnabled(data.config.tpaEnabled || false);
          setYoutubeDiscordChannel(data.config.youtubeDiscordChannelId || "");
          setTiktokDiscordChannel(data.config.tiktokDiscordChannelId || "");
          setTwitchDiscordChannel(data.config.twitchDiscordChannelId || "");
        } else if (res.status === 404) {
          setConfig(null);
          setEnabled(false);
        }

        // Fetch guild data from localhost:3001/dashboard/@me/guilds/
        const guildsRes = await fetch(`${NEXT_PUBLIC_API}/dashboard/@me/guilds/`, { credentials: "include" });
        if (guildsRes.ok) {
          const guildsData = await guildsRes.json();
          // Find the guild that matches the guildId and set its channels
          const guild = guildsData.find((g: any) => g.id === guildId);
          if (guild && guild.channels) {
            setChannels(guild.channels);
          }
        } else {
          console.error("Error fetching guilds or channels");
        }
      } catch (error) {
        console.error("Error fetching tpa configuration:", error);
      }
      setLoading(false);
    })();
  }, [guildId]);

  if (!guildId) {
    return <div>Missing Guild ID! Login to view this!</div>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  const handleToggle = async () => {
    const newEnabledState = !enabled;
    setEnabled(newEnabledState);

    try {
      const res = await fetch(`${NEXT_PUBLIC_API}/dashboard/thirdpartyannouncements`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          guildId,
          tpaEnabled: newEnabledState,
          youtubeDiscordChannelId: youtubeDiscordChannel,
          youtubeChannelUrl: youtubeUrl,
          tiktokDiscordChannelId: tiktokDiscordChannel,
          tiktokChannelUrl: tiktokUrl,
          twitchDiscordChannelId: twitchDiscordChannel,
          twitchChannelUrl: twitchUrl
        })
      });

      if (res.ok) {
        const data = await res.json();
        setConfig(data.config);
        setEnabled(data.config.tpaEnabled);
      } else {
        alert("Error saving configuration.");
        setEnabled(!newEnabledState);
      }
    } catch (error) {
      console.error("Error saving configuration:", error);
      alert("Error saving configuration.");
      setEnabled(!newEnabledState);
    }
  };

  return (
    <div className="mt-6 bg-gray-700 p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Third Party Announcements</h2>
      <h2 className="text-2 mb-4 text-gray-400">
        Notifications from third party apps such as YouTube, TikTok, Twitch, sent directly to your Discord server!
      </h2>

      <div className="mb-4 flex items-center">
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" checked={enabled} onChange={handleToggle} />
          <div className="w-11 h-6 bg-gray-400 rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
          <div
            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-all ${
              enabled ? "translate-x-5" : ""
            }`}
          ></div>
        </label>
      </div>

      {["YouTube", "TikTok", "Twitch"].map((platform) => {
        const channelUrlPrefix = {
          YouTube: "https://youtube.com/@",
          TikTok: "https://tiktok.com/@",
          Twitch: "https://twitch.tv/"
        };

        const urlValue = {
          YouTube: youtubeUrl,
          TikTok: tiktokUrl,
          Twitch: twitchUrl
        };

        const setUrlValue = {
          YouTube: setYoutubeUrl,
          TikTok: setTiktokUrl,
          Twitch: setTwitchUrl
        };

        const discordChannel = {
          YouTube: youtubeDiscordChannel,
          TikTok: tiktokDiscordChannel,
          Twitch: twitchDiscordChannel
        };
        const setDiscordChannel = {
          YouTube: setYoutubeDiscordChannel,
          TikTok: setTiktokDiscordChannel,
          Twitch: setTwitchDiscordChannel
        };

        return (
          <div key={platform} className="mb-4">
            <label className="block text-lg font-medium mb-2">{platform} Notification Channel</label>
            <select
              value={discordChannel[platform as keyof typeof discordChannel]}
              onChange={(e) => setDiscordChannel[platform as keyof typeof discordChannel](e.target.value)}
              className={`w-full p-2 rounded bg-gray-800 text-white border border-gray-600 transition-all ${
                !enabled ? "bg-gray-600 cursor-not-allowed opacity-60" : ""
              }`}
              disabled={!enabled}
            >
              <option value="">Select a channel</option>
              {channels.map((chan) => (
                <option key={chan.id} value={chan.id}>
                  {chan.name}
                </option>
              ))}
            </select>

            <label className="block text-md font-medium mt-3 mb-1 text-gray-300">Channel URL</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md bg-gray-600 text-gray-300 text-sm">
                {channelUrlPrefix[platform]}
              </span>
              <input
                type="text"
                value={urlValue[platform]}
                onChange={(e) => setUrlValue[platform](e.target.value)}
                className={`w-full p-2 rounded-r bg-gray-800 text-white border border-gray-600 transition-all ${
                  !enabled ? "bg-gray-600 cursor-not-allowed opacity-60" : ""
                }`}
                placeholder="username or channel name"
                disabled={!enabled}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
