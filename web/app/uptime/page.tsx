"use client";

import { useEffect, useState } from 'react';
import { useSectionInView } from "@/lib/hooks";

const Uptime = () => {
  const { ref } = useSectionInView("Uptime");

  const [uptime, setUptime] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUptime = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SITE}/uptime`);

        if (!response.ok) {
          throw new Error('Failed to fetch uptime data');
        }

        const data = await response.json();
        setUptime(data.uptime); 
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUptime();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!uptime) {
    return <div>Loading...</div>;
  }

  return (
    <div id="uptime" ref={ref}>
      <h1>Bot Uptime</h1>
      <p>{`Uptime: ${uptime.hours} hours, ${uptime.minutes} minutes, ${uptime.seconds} seconds`}</p>
    </div>
  );
};

export default Uptime;
