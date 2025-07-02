"use client";

import { useEffect, useState } from "react";

import Smartinput from "@/components/input/smart-input";
import { useSectionInView } from "@/lib/hooks";

interface Command {
    name: string;
    description: string;
    id: string;
}

export default function CommandsPage() {
    const { ref } = useSectionInView("Commands");

    // @typescript-eslint/no-unused-vars: just for now i will fix this

    const [commands, setCommands] = useState<Command[]>([]);
    const [filteredCommands, setFilteredCommands] = useState<Command[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchCommands = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API}/commands`);
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

    return (
        <div className="p-25 px-4" id="commands" ref={ref}>
            <h1 className="text-3xl font-bold mb-6">Commands</h1>

            <div className="relative w-full max-w-md">
                <Smartinput value={search} setValue={setSearch} placeholder="Search by name" thin />
            </div>

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
                        <div key={command.id} className="rounded4xlbutton">
                            <h2 className="text-xl font-semibold">{command.name}</h2>
                            <p className="text-stone-400 text-sm">{command.description}</p>
                            <button onClick={() => handleCopyId(command.id)} className="mt-4 button">
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