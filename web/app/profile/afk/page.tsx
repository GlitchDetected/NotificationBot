'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const NEXT_PUBLIC_BACKEND_SITE = process.env.NEXT_PUBLIC_BACKEND_SITE;

interface AfkData {
  id: number;
  userId: string;
  message: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

interface AfkComponentProps {
  userId: string;
}

export default function Afk() {
  const [afkData, setAfkData] = useState<AfkData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
    const fetchAfkData = async () => {
      if (!userId) return;

      try {
        const res = await fetch(
          `${NEXT_PUBLIC_BACKEND_SITE}/dashboard/afk?userId=${userId}`,
          { credentials: 'include' }
        );

        if (!res.ok) {
          throw new Error('Error fetching AFK data');
        }

        const data = await res.json();
        setAfkData(data.afkData);
      } catch (err) {
        setError('You are not currently in afk mode. Use /afk to start your afk session!');
      } finally {
        setLoading(false);
      }
    };

    fetchAfkData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 p-4 rounded-md shadow-md">
        <h3 className="text-xl text-white font-semibold">AFK Status</h3>
        <div className="skeleton h-10 bg-gray-700 rounded-md"></div>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  if (!afkData) {
    return (
      <div className="bg-gray-800 p-4 rounded-md shadow-md">
        <h3 className="text-xl text-white font-semibold">AFK Status</h3>
        <div className="skeleton h-10 bg-gray-700 rounded-md"></div>
        <p className="text-gray-400">No AFK data available yet. Use /afk</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded-md shadow-md">
      <h3 className="text-xl text-white font-semibold">AFK Status</h3>
      <p className="text-gray-400">Message: {afkData.message}</p>
      <p className="text-gray-400">Duration: {afkData.duration} minutes</p>
      <p className="text-gray-400">Created At: {new Date(afkData.createdAt).toLocaleString()}</p>
      <p className="text-gray-400">Last Updated: {new Date(afkData.updatedAt).toLocaleString()}</p>
    </div>
  );
}
