'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const NEXT_PUBLIC_BACKEND_SITE = process.env.NEXT_PUBLIC_BACKEND_SITE;

export default function UserRankConfigPage() {
  const [bgColor, setBgColor] = useState('#000000');
  const [barColor, setBarColor] = useState('#FFFFFF');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${NEXT_PUBLIC_BACKEND_SITE}/dashboard/@me`, {
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Not authenticated');

        const userResponse = await res.json();
        const user = userResponse.dataValues;
        setUserId(user.id);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }

    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchConfig() {
      if (!userId) return;

      try {
        const res = await fetch(
          `${NEXT_PUBLIC_BACKEND_SITE}/dashboard/userrankconfig?userId=${userId}`,
          { credentials: 'include' }
        );

        if (res.ok) {
          const data = await res.json();
          setBgColor(data.bgColor || '#000000');
          setBarColor(data.barColor || '#FFFFFF');
        }
      } catch (error) {
        console.error('Error fetching user rank configuration', error);
      } finally {
        setLoading(false);
      }
    }

    if (userId) fetchConfig();
  }, [userId]); // Runs only when userId is available

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!userId) {
      setMessage('User not authenticated.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${NEXT_PUBLIC_BACKEND_SITE}/dashboard/userrankconfig`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, bgColor, barColor }),
      });

      if (res.ok) {
        setMessage('Configuration saved successfully!');
      } else {
        const data = await res.json();
        setMessage(data.message || 'Failed to save configuration.');
      }
    } catch (error) {
      console.error('Error saving configuration', error);
      setMessage('Error saving configuration.');
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
      <h2 className="text-2 mb-4 text-gray-400">DM Notifications notify you about new uploads. Refer to /docs for help</h2>

      <form onSubmit={handleSubmit} className="bg-gray-700 p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <label className="text-white">Background Color:</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-12 h-12 border-0"
          />
          <span className="text-white">{bgColor}</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <label className="text-white">Bar Color:</label>
          <input
            type="color"
            value={barColor}
            onChange={(e) => setBarColor(e.target.value)}
            className="w-12 h-12 border-0"
          />
          <span className="text-white">{barColor}</span>
        </div>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          {loading ? 'Saving...' : 'Save Configuration'}
        </button>
        {message && <p className="mt-4 text-white">{message}</p>}
      </form>
    </div>
  );
}
