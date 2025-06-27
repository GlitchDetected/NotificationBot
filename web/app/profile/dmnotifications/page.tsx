"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API;

export default function UserRankConfigPage() {
  const [embedColor, setEmbedColor] = useState("#FF0000");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${NEXT_PUBLIC_API}/dashboard/@me`, {
          credentials: "include"
        });

        if (!res.ok) throw new Error("Not authenticated");

        const userResponse = await res.json();
        const user = userResponse.dataValues;
        setUserId(user.id);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }

    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchConfig() {
      if (!userId) return;

      try {
        const res = await fetch(`${NEXT_PUBLIC_API}/dashboard/dmnotifications?userId=${userId}`, {
          credentials: "include"
        });

        if (res.ok) {
          const data = await res.json();
          setEmbedColor(data.embedColor || "#FF0000");
          setSource(data.source);
        }
      } catch (error) {
        console.error("Error fetching user rank configuration", error);
      } finally {
        setLoading(false);
      }
    }

    if (userId) fetchConfig();
  }, [userId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!userId) {
      setMessage("User not authenticated.");
      setLoading(false);
      return;
    }

    if (!source) {
    setMessage("Please complete all required fields.");
    setLoading(false);
    return;
    }

    try {
      const res = await fetch(`${NEXT_PUBLIC_API}/dashboard/dmnotifications`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId, embedColor, source })
      });

      if (res.ok) {
        setMessage("Configuration saved successfully!");
      } else {
        const data = await res.json();
        setMessage(data.message || "Failed to save configuration.");
      }
    } catch (error) {
      console.error("Error saving configuration", error);
      setMessage("Error saving configuration.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-10 px-4">
      <h2 className="text-2xl font-semibold mb-4 text-white">Setup DM Notifications</h2>
      <h2 className="text-2 mb-4 text-gray-400">
        DM Notifications notify you about new uploads. Refer to /docs for help
      </h2>

      <form onSubmit={handleSubmit} className="bg-gray-700 p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <label className="text-white">Embed color:</label>
          <input
            type="color"
            value={embedColor}
            onChange={(e) => setEmbedColor(e.target.value)}
            className="w-12 h-12 border-0"
          />
          <span className="text-white">{embedColor}</span>
        </div>
          <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-white">Source</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="example.com/feeds/rss.xml"
            className="p-2 rounded bg-[#222] text-white border border-gray-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 p-15"
        >
          {loading ? "Saving..." : "Save Configuration"}
        </button>
        {message && <p className="mt-4 text-red cursor-pointer">{message}</p>}
      </form>
    </div>
  );
}
