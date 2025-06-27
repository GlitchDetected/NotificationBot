"use client";

import { Loader2, RefreshCcw, Search, LayoutDashboard, CircleUser } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaDiscord } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

import Searchbar from "@/components/ui/searchbar";

const NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API;
const SIGNIN_URL = `${NEXT_PUBLIC_API}/auth/signin`;
const ADD_BOT_URL = `/add`;

export default function GuildsList() {
  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Fetch user data and guilds
    (async () => {
      setLoading(true);

      try {
        const res = await fetch(`${NEXT_PUBLIC_API}/dashboard/@me`, {
          credentials: "include"
        });

        if (!res.ok) {
          if (res.status === 401) {
            window.location.href = SIGNIN_URL;
            throw new Error("Not authenticated");
          }
          throw new Error("An error occurred");
        }

        const userResponse = await res.json();
        const user = userResponse.dataValues;

        setUser(user);

        const guildsRes = await fetch(`${NEXT_PUBLIC_API}/dashboard/@me/guilds`, {
          credentials: "include"
        });

        if (!guildsRes.ok) {
          throw new Error("An error occurred");
        }

        const guilds = await guildsRes.json();
        setGuilds(guilds);
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    })();
  }, []);

  async function handleRefresh() {
    setLoading(true);

    try {
      const res = await fetch(`${NEXT_PUBLIC_API}/dashboard/@me/guilds?skipcache=true`, {
        credentials: "include"
      });

      if (!res.ok) {
        throw new Error("An error occurred");
      }

      const guilds = await res.json();
      setGuilds(guilds);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  const filteredGuilds = guilds.filter((guild) => guild.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <>
        <div className="flex items-center justify-center gap-3 p-5">
          <div className="relative w-full max-w-md">
            <Searchbar
            value={search}
            setValue={setSearch}
            placeholder="Search by name"
            thin
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href={ADD_BOT_URL}
              className="roundedlgbutton flex items-center gap-x-2"
            >
              <FaDiscord className="w-5 h-5" />
              <span>Add Bot</span>
            </Link>

            <motion.button
              disabled={loading}
              whileTap={{ scale: 0.95 }}
              className="roundedlgbutton flex items-center gap-x-2 px-4 py-2"
              onClick={handleRefresh}
            >
              <RefreshCcw className={`w-5 h-5 ${loading && "animate-spin"}`} />
              <span>Refresh</span>
            </motion.button>
          </div>
        </div>

        {/* Server List */}
        <div className="flex flex-wrap items-center justify-center gap-5 w-fit mx-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-12 h-12 animate-spin" />
            </div>
          ) : (
            <>
              {!filteredGuilds.length ? (
                <p className="text-white text-center">No servers found! Create a new server or click add bot to get start!</p>
              ) : (
                filteredGuilds.map((guild) => (
                  <motion.div
                    key={guild.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    whileHover={{ scale: 1.05 }}
                    className={`flex flex-col p-4 bg-red-950 border border-red-500 rounded-md mb-2 justify-center items-center relative overflow-hidden w-full max-w-[320px] sm:w-52 shadow-lg ${
                      !guild.botInGuild ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {guild.icon ? (
                      <>
                        <Image
                          src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=256`}
                          alt={guild.name}
                          className="absolute inset-0 blur-sm w-full h-1/2 -z-20 object-cover brightness-[20%]"
                          aria-hidden
                          width={256}
                          height={256}
                          priority
                        />
                        <Image
                          src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=128`}
                          alt={guild.name}
                          className="w-14 h-14 rounded-full mb-2"
                          width={128}
                          height={128}
                          priority
                        />
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gray-600 blur-sm w-full h-1/2 -z-20 object-cover brightness-[20%]" />
                        <div className="w-14 h-14 rounded-full mb-2 bg-blue-600 flex items-center justify-center">
                          <FaDiscord className="w-8 h-8 text-white" />
                        </div>
                      </>
                    )}
                    <h3 className="mb-4 font-semibold text-center text-white truncate">{guild.name}</h3>

                    {/* Conditional Button */}
                    {guild.botInGuild ? (
                      <Link
                        href={`/dashboard/${guild.id}`}
                        className=" roundedlgbutton flex items-center space-x-2 px-4 py-2"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        Manage
                      </Link>
                    ) : (
                      <Link
                        href={`/add`}
                        className="roundedlgbutton flex items-center space-x-2 px-4 py-2
                              text-base sm:text-sm md:text-md lg:text-lg whitespace-nowrap"
                      >
                        <FaDiscord className="w-5 h-5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                        <span>Add Bot</span>
                      </Link>
                    )}
                  </motion.div>
                ))
              )}
            </>
          )}
        </div>
      </>
    </div>
  );
}
