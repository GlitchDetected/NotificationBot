"use client";

import React, { useEffect, useState } from "react";
import { CircleUser, LogOut, Menu, LayoutDashboard, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { links } from "@/lib/data";
import { BsDiscord } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { Skeleton } from "@heroui/react";

import { defaultFetchOptions } from "@/lib/api"; 

export const NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API;

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${NEXT_PUBLIC_API}/dashboard/@me`, {
          ...defaultFetchOptions,
          credentials: "include"
        });

        if (!res.ok) {
          throw new Error("Not authenticated");
        }

        const userResponse = await res.json();
        const user = userResponse.dataValues;

        setUser(user);
      } catch (error: any) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleLogout() {
    try {
      const res = await fetch(`${NEXT_PUBLIC_API}/auth/signout`, {
        method: "GET",
        credentials: "include"
      });

      if (!res.ok) {
        throw new Error("Failed to logout");
      }

      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <header className="z-[999] relative">
      <nav className="fixed top-0 left-1/2 transform -translate-x-1/2 h-[4.5rem] w-full rounded-none border-opacity-40 sm:rounded-lg flex items-center px-10 md:px-15 lg:px-20 justify-between bg-white shadow-md dark:bg-red-950 dark:shadow-black/90 z-[999] sm:top-6 sm:h-[4rem] sm:w-[55rem]">

        <div className="flex items-center gap-4">
          {loading ? (
            // Skeleton loader for the logo and text
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div> {/* Logo skeleton */}
              <div className="w-24 h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div> {/* Text skeleton */}
            </div>
          ) : (
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/notificationbot_transparent.png" alt="Logo" width={50} height={50} />
              <span className="text-lg font-semibold">NotificationBot</span>
            </Link>
          )}
        </div>

        {/* Desktop Navigation - Only visible on large screens */}
        <ul className="hidden md:flex flex-1 items-center justify-center gap-8 text-[0.9rem] font-medium text-gray-500 dark:text-gray-400">
          {links.map((link) => (
            <motion.li
              className="relative"
              key={link.hash}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <Link className="px-3 py-2 hover:text-gray-950 dark:hover:text-gray-300 transition" href={link.hash}>
                {link.name}
              </Link>
            </motion.li>
          ))}
        </ul>

        {/* Right-side: Login Button + Hamburger Menu */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-24 h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </div>
            ) : user ? (
              <div>
                <button onClick={() => setIsDropdownOpen((prev) => !prev)} className="focus:outline-none">
                  {user.avatarHash ? (
                    <Image
                      src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatarHash}.webp?size=128`}
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="rounded-full cursor-pointer border-2 border-white"
                      priority
                    />
                  ) : (
                    <CircleUser className="w-10 h-10 cursor-pointer border-2 border-white" />
                  )}
                </button>

                {/* glassmorphism themed */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-64 bg-[#212121] bg-opacity-70 rounded-lg shadow-lg overflow-hidden text-white backdrop-blur-md border border-white/10 backdrop-filter bg-opacity-10"
                    >
                      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-500">
                        {user.avatarHash ? (
                          <Image
                            src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatarHash}.webp?size=128`}
                            alt="User Avatar"
                            width={40}
                            height={40}
                            className="rounded-full"
                            priority
                          />
                        ) : (
                          <CircleUser className="w-10 h-10" />
                        )}
                        <div>
                          <div className="text-xs text-gray-400">{user.displayName || "No Display Name"}</div>
                          <div className="font-semibold text-sm">{user.username}</div>
                        </div>
                      </div>
                      <ul>
                        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={handleLogout}>
                          <div className="flex items-center gap-2 cursor-pointer">
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </div>
                        </li>
                        <div
                          onClick={() => router.push(`/profile`)}
                          className="px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-700"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Profile</span>
                        </div>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href={`${NEXT_PUBLIC_API}/auth/signin`}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#5865F2] text-white hover:bg-[#4c58d4] transition duration-200"
              >
                <BsDiscord className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}
          </div>

          <button className="md:hidden z-50" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu (Sliding Down Effect) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-90 flex flex-col items-center justify-center text-white space-y-6"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <button className="absolute top-6 right-6 text-white" onClick={() => setIsMenuOpen(false)}>
              <X className="w-10 h-10" />
            </button>
            {links.map((link) => (
              <Link
                key={link.hash}
                href={link.hash}
                className="text-xl font-semibold hover:text-gray-300 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
