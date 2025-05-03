'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const NEXT_PUBLIC_BACKEND_SITE = process.env.NEXT_PUBLIC_BACKEND_SITE;

export default function RankTab() {
  const { guildId } = useParams();
  const router = useRouter();
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [noAccess, setNoAccess] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setUnauthorized(false);
      setNoAccess(false);
      try {
        const res = await fetch(`${NEXT_PUBLIC_BACKEND_SITE}/dashboard/leaderboard?guildId=${guildId}`, {
          credentials: 'include',
        });

        if (res.status === 401) {
          setUnauthorized(true);
          return;
        }

        if (res.status === 403) {
          setNoAccess(true);
          return;
        }

        if (!res.ok) throw new Error('Failed to fetch ranks');

        const data = await res.json();
        setRanks(data);
      } catch (error) {
        console.error('Error fetching ranks:', error);
      }
      setLoading(false);
    })();
  }, [guildId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  if (unauthorized) {
    return <p className="text-red-500 text-center">User not logged in!</p>;
  }

  if (noAccess) {
    return <p className="text-yellow-500 text-center">No access!</p>;
  }

  if (!ranks.length) {
    return <p className="text-gray-500">No rank data available for this guild.</p>;
  }

  return (
    <div className="mt-6">
      <h1 className="text-3xl font-semibold text-gray-100 mb-6">User Ranks</h1>
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg shadow-gray-600">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4">User ID</th>
              <th className="text-left py-3 px-4">XP</th>
              <th className="text-left py-3 px-4">Level</th>
            </tr>
          </thead>
          <tbody>
            {ranks.map((rank, index) => (
              <tr key={index} className="border-b border-gray-700">
                <td className="py-3 px-4">{rank.userId}</td>
                <td className="py-3 px-4">{rank.xp}</td>
                <td className="py-3 px-4">{rank.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => router.push(`/dashboard/${guildId}`)}
        className="mt-4 px-4 py-2 bg-gray-800 rounded hover:bg-gray-900 transition w-full cursor-pointer"
      >
        Back to guild manage page
      </button>

    </div>
  );
}