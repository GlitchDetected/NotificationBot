"use client";

import { useEffect, useState } from "react";
import { useSectionInView } from "@/lib/hooks";

interface Command {
  name: string;
  description: string;
  id: string;
}

export default function CommandsPage() {
  const { ref } = useSectionInView("Commands");

  const [commands, setCommands] = useState<Command[]>([]);
  const [filteredCommands, setFilteredCommands] = useState<Command[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCommands = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SITE}/commands`);
        if (!response.ok) {
          throw new Error(`Failed to fetch commands: ${response.statusText}`);
        }

        const data = await response.json();
        setCommands(data.commands);
        setFilteredCommands(data.commands); // Initialize filtered list
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setLoading(false);
      }
    };

    fetchCommands();
  }, []);

  const handleCopyId = (id: string) => {
    navigator.clipboard
      .writeText(id)
      .then(() => {
        setShowPopup(true);

        setTimeout(() => {
          setShowPopup(false);
        }, 3000); // 3 seconds instead of 10 seconds
      })
      .catch((err) => {
        alert("Failed to copy ID: " + err);
      });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = commands.filter(
      (command) => command.name.toLowerCase().includes(value) || command.description.toLowerCase().includes(value)
    );
    setFilteredCommands(filtered);
  };

  if (loading) {
    return <p>Server is thinking...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="p-6 px-4" id="commands" ref={ref}>
      <h1 className="text-3xl font-bold mb-6">Commands</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Click here to start searching..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-3 mb-6 rounded-lg border border-stone-950 bg-stone-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
      />

      {/* Copied Popup (fixed position) */}
      {showPopup && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-black text-white py-2 px-6 rounded-full opacity-90 transition-opacity duration-500">
          Copied!
        </div>
      )}

      {/* Commands List - Now maps over filteredCommands */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommands.length > 0 ? (
          filteredCommands.map((command) => (
            <div key={command.id} className="bg-stone-900 p-4 rounded-4xl shadow-md border border-stone-950">
              <h2 className="text-xl font-semibold">{command.name}</h2>
              <p className="text-stone-400 text-sm">{command.description}</p>
              <button
                onClick={() => handleCopyId(command.id)}
                className="mt-4 bg-stone-800 hover:bg-stone-950 text-white py-2 px-4 rounded-4xl cursor-pointer"
              >
                Copy ID
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No commands found.</p>
        )}
      </div>
    </div>
  );
}
