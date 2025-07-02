"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API;

export default function Webhook() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [message, setMessage] = useState("");
  const [webhookAvatar, setWebhookAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchWebhookData = async () => {
      try {
        const res = await fetch(`${NEXT_PUBLIC_API}/dashboard/webhook`, {
          method: "GET",
          credentials: "include"
        });

        if (!res.ok) throw new Error("Failed to fetch webhook data");

        const data = await res.json();
        setWebhookUrl(data.webhookUrl || "");
        setMessage(data.message || "");
        setWebhookAvatar(data.webhookavatar || "");
        setUsername(data.username || "");
      } catch (error) {
        console.error("Error fetching webhook data:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchWebhookData();
  }, []);

  const sendWebhook = async () => {
    if (!webhookUrl || !message) {
      alert("Webhook url and message is required! Avatar and username is optional!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${NEXT_PUBLIC_API}/dashboard/webhook`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          webhookUrl,
          message,
          webhookavatar: webhookAvatar || "",
          username: username || ""
        })
      });

      if (!res.ok) throw new Error("Failed to send webhook");

      alert("Webhook sent successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Error sending webhook");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  const formattedTime = new Date().toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
      {/* Left Side - Input Fields */}
      <div className="w-full md:w-1/2">
        <h2 className="text-lg font-semibold text-white">Send Webhook</h2>

        <div className="mt-2">
          <label className="block text-gray-300">Webhook URL:</label>
          <input
            type="text"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="w-full p-2 mt-1 text-gray-900 bg-gray-200 rounded-md"
            placeholder="Enter Webhook URL"
          />
        </div>

        <div className="mt-2">
          <label className="block text-gray-300">Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 mt-1 text-gray-900 bg-gray-200 rounded-md"
            placeholder="Enter message"
          />
        </div>

        <div className="mt-2">
          <label className="block text-gray-300">Avatar URL (Optional):</label>
          <input
            type="text"
            value={webhookAvatar}
            onChange={(e) => setWebhookAvatar(e.target.value)}
            className="w-full p-2 mt-1 text-gray-900 bg-gray-200 rounded-md"
            placeholder="Enter avatar URL"
          />
        </div>

        <div className="mt-2">
          <label className="block text-gray-300">Username (Optional):</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mt-1 text-gray-900 bg-gray-200 rounded-md"
            placeholder="Enter username"
          />
        </div>

        <button
          onClick={sendWebhook}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Webhook"}
        </button>
      </div>

      {/* Right Side - Message Preview */}
      <div className="w-full md:w-1/2 bg-gray-900 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-white">Message Preview</h3>
        <div className="mt-4 flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
          {/* Avatar */}
          {webhookAvatar ? (
            <img src={webhookAvatar} alt="Avatar" className="w-12 h-12 rounded-full" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-gray-300">?</div>
          )}
          <div>
            <div className="flex items-center space-x-2">
              <p className="text-white font-bold">{username || "Webhook"}</p>

              {/* APP Tag */}
              <span className="bg-[#1447E6] text-white text-xs font-semibold px-2 py-1 rounded-md">APP</span>

              <span className="text-gray-400 text-xs">{formattedTime}</span>
            </div>
            <p className="text-gray-300">{message || "Your message will appear here..."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}