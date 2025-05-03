'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ChannelType } from "discord-api-types/v10";
import Image from "next/image";
import { ScreenMessage } from "@/components/screen-message";
import { OverviewLink } from "@/components/overview-link";

const NEXT_PUBLIC_BACKEND_SITE = process.env.NEXT_PUBLIC_BACKEND_SITE;

interface RankConfig {
  guildId: string;
  rankchannel: string | null;
  rankconfigure: boolean;
}

interface Channel {
  id: string;
  name: string;
}

export default function RankConfigPage() {
  const { guildId } = useParams();
  const router = useRouter();
  const [config, setConfig] = useState<RankConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [channel, setChannel] = useState('');
  const params = useParams();
  const [channels, setChannels] = useState<Channel[]>([]); // Add state to store channels
  const url = `/guilds/${params.guildId}/rank` as const;

  useEffect(() => {
    if (!guildId) return;

    (async () => {
      setLoading(true);
      try {
        // Fetch rank configuration
        const res = await fetch(
          `${NEXT_PUBLIC_BACKEND_SITE}/dashboard/rankconfigure?guildId=${guildId}`,
          { credentials: 'include' }
        );
        if (res.ok) {
          const data = await res.json();
          setConfig(data.config);
          setEnabled(data.config.rankconfigure || false);
          setChannel(data.config.rankchannel || '');
        } else if (res.status === 404) {
          setConfig(null);
          setEnabled(false);
        }

        // Fetch guild data (including channels) from /dashboard/@me/guilds/
        const guildsRes = await fetch(
          `${NEXT_PUBLIC_BACKEND_SITE}/dashboard/@me/guilds/`,
          { credentials: 'include' }
        );
        if (guildsRes.ok) {
          const guildsData = await guildsRes.json();
          // Find the guild that matches the guildId and set its channels
          const guild = guildsData.find((g: any) => g.id === guildId);
          if (guild && guild.channels) {
            setChannels(guild.channels); // Set the channels
          }
        } else {
          console.error('Error fetching guilds or channels');
        }
      } catch (error) {
        console.error('Error fetching rank configuration:', error);
      }
      setLoading(false);
    })();
  }, [guildId]);

  if (!guildId) {
    return <div>Error: Missing Guild ID! Please login!</div>;
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
      const res = await fetch(`${NEXT_PUBLIC_BACKEND_SITE}/dashboard/rankconfigure`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guildId,
          rankconfigure: newEnabledState,
          rankchannel: channel,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setConfig(data.config);
        setEnabled(data.config.rankconfigure);
      } else {
        alert('Error saving configuration.');
        setEnabled(!newEnabledState);
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Error saving configuration.');
      setEnabled(!newEnabledState);
    }
  };

  return (
    <div className="mt-6 bg-gray-700 p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Rank Configuration</h2>

      <div className="mb-4 flex items-center">
        <span className="text-lg font-medium mr-4">Enable Rank System</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" checked={enabled} onChange={handleToggle} />
          <div className="w-11 h-6 bg-gray-400 rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
          <div
            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-all ${
              enabled ? 'translate-x-5' : ''
            }`}
          ></div>
        </label>
        <span className="ml-3 text-sm">{enabled ? 'Enabled' : 'Disabled'}</span>
      </div>

      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">Rank Channel</label>
        <select
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          className={`w-full p-2 rounded bg-gray-800 text-white border border-gray-600 transition-all ${
            !enabled ? 'bg-gray-600 cursor-not-allowed opacity-60' : ''
          }`}
          disabled={!enabled} // Visually disabled but still interactable
        >
          <option value="">Select a channel</option>
          {channels.map((chan) => (
            <option key={chan.id} value={chan.id}>
              {chan.name} {/* Display channel name here */}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">Rank Channel ID</label>
        <input
          type="text"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          placeholder="Enter channel ID"
          className={`w-full p-2 rounded bg-gray-800 text-white border border-gray-600 transition-all ${
            !enabled ? 'bg-gray-600 cursor-not-allowed opacity-60' : ''
          }`}
        />
      </div>

      <button
        onClick={handleToggle}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {enabled ? 'Disable' : 'Enable'}
      </button>

      {/* View Leaderboard Button */}
      <button
        onClick={() => router.push(`/leaderboard/${guildId}`)}
        className="mt-4 px-4 py-2 bg-gray-800 rounded hover:bg-gray-900 transition w-full cursor-pointer"
      >
        View Leaderboard
      </button>
    </div>
  );
}
