"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const NEXT_PUBLIC_BACKEND_SITE = process.env.NEXT_PUBLIC_BACKEND_SITE;
const SIGNIN_URL = `${NEXT_PUBLIC_BACKEND_SITE}/auth/signin`;

const PERMISSIONS_MAP = {
  1: "Create Instant Invite",
  2: "Kick Members",
  4: "Ban Members",
  8: "Administrator",
  16: "Manage Channels",
  32: "Manage Guild",
  64: "Add Reactions",
  128: "View Audit Log",
  256: "Priority Speaker",
  512: "Stream",
  1024: "View Channel",
  2048: "Send Messages",
  4096: "Send TTS Messages",
  8192: "Manage Messages",
  16384: "Embed Links",
  32768: "Attach Files",
  65536: "Read Message History",
  131072: "Mention Everyone",
  262144: "Use External Emojis",
  524288: "View Guild Insights",
  1048576: "Connect",
  2097152: "Speak",
  4194304: "Mute Members",
  8388608: "Deafen Members",
  16777216: "Move Members",
  33554432: "Use VAD",
  67108864: "Change Nickname",
  134217728: "Manage Nicknames",
  268435456: "Manage Roles",
  536870912: "Manage Webhooks",
  1073741824: "Manage Emojis and Stickers",
  2147483648: "Use Slash Commands"
};

export default function GuildConfigure() {
  const { guildId } = useParams();
  const [guild, setGuild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prefix, setPrefix] = useState("`");
  const [saving, setSaving] = useState(false);
  const params = useParams();

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        const res = await fetch(`${NEXT_PUBLIC_BACKEND_SITE}/dashboard/@me/guilds`, {
          credentials: "include"
        });

        if (!res.ok) {
          if (res.status === 401) {
            window.location.href = SIGNIN_URL;
            throw new Error("Not authenticated");
          }
          throw new Error("An error occurred");
        }

        const guilds = await res.json();
        const selectedGuild = guilds.find((guild) => guild.id === guildId);

        if (selectedGuild) {
          setGuild(selectedGuild);
          setPrefix(selectedGuild.botPrefix || ";");
        } else {
          console.error("Guild not found");
        }
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    })();
  }, [guildId]);

  const handlePrefixChange = (e) => {
    const value = e.target.value;
    if (value.length <= 3) {
      setPrefix(value);
    }
  };

  const savePrefix = async () => {
    if (!guild) return;
    setSaving(true);

    try {
      const res = await fetch(`${NEXT_PUBLIC_BACKEND_SITE}/dashboard/@me/guilds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ guildId, prefix })
      });

      if (!res.ok) throw new Error("Failed to update prefix");

      const data = await res.json();
      setPrefix(data.botPrefix);

      alert("Prefix updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Error updating prefix");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  if (!guild) {
    return <p>No guild found with ID: {guildId}</p>;
  }

  const getPermissions = (permissions) => {
    const permissionBitfield = parseInt(permissions, 10);
    return Object.entries(PERMISSIONS_MAP)
      .filter(([bit]) => permissionBitfield & parseInt(bit))
      .map(([, name]) => name);
  };

  return (
    <div>
      <div className="bg-gray-700 p-4 rounded-lg shadow-md">
        <p>
          <strong>Guild ID:</strong> {guild.id}
        </p>
        <p>
          <strong>Owner:</strong> {guild.owner ? "Yes" : "No"}
        </p>
        <p>
          <strong>Features:</strong> {guild.features.join(", ")}
        </p>

        <div className="mt-4">
          <h2 className="text-lg font-semibold">Bot Prefix Configuration</h2>
          <div className="mt-2 flex items-center space-x-2">
            <input
              type="text"
              value={prefix}
              onChange={handlePrefixChange}
              maxLength={3}
              className="p-2 text-gray-900 bg-gray-200 rounded-md"
            />
            <button
              onClick={savePrefix}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-1">Max 3 characters</p>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold">Bot Permissions</h2>
          <ul className="mt-2 bg-black p-4 rounded-lg shadow">
            {getPermissions(guild.permissions).map((perm, idx) => (
              <li key={idx} className="py-1 text-gray-600">
                - {perm}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
