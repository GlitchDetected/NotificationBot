"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

import { LoginButton } from "@/components/ui/login-button";
import { LoginHeader } from "@/components/ui/nav-header";
import { links } from "@/lib/data";

export default function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [auth, setAuth] = useState(false);

    // Check for sessiontoken on client
    useEffect(() => {
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("sessiontoken="))
            ?.split("=")[1];

        setTimeout(() => setAuth(Boolean(token)), 0);
    }, []);

    return (
        <nav className="fixed top-0 left-1/2 transform -translate-x-1/2
                    w-full sm:w-[55rem] h-[4.5rem] sm:h-[4rem]
                    sm:top-6 z-[999]
                    flex items-center justify-between
                    px-4 sm:px-10 lg:px-20
                    rounded-none sm:rounded-xl
                    shadow-xs shadow-gray-600/90
                    bg-foreground/40 backdrop-blur-xs backdrop-brightness-75">

            {/* Left: Logo */}
            <div className="hidden sm:flex ml-auto">
                <Link href="/" className="flex items-center gap-1">
                    <Image
                        src="/bot.webp"
                        alt="Logo"
                        width={40}
                        height={40}
                    />
                </Link>
            </div>


            {/* Desktop Links */}
            <ul className="hidden sm:flex flex-1 justify-center gap-8 text-[0.9rem] font-medium">
                {links.map((link) => (
                    <Link
                        key={link.hash}
                        className="px-3 py-2 transition hover:text-red-600"
                        href={link.hash}
                    >
                        {link.name}
                    </Link>
                ))}
            </ul>

            {/* Auth Buttons - Desktop */}
            <div className="hidden sm:flex ml-auto">
                {auth ? <LoginHeader /> : <LoginButton />}
            </div>

            {/* Mobile Hamburger */}
            <div className="sm:hidden ml-auto">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-2 rounded-md bg-gray-700/50 hover:bg-gray-700/70 transition"
                >
                    {menuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="absolute top-full left-0 w-full bg-foreground/90 backdrop-blur-md flex flex-col items-center gap-4 py-4 sm:hidden z-[998]">
                    {/* Mobile Links */}
                    {links.map((link) => (
                        <Link
                            key={link.hash}
                            className="px-4 py-2 w-full text-center hover:bg-blurple/30 rounded"
                            href={link.hash}
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Auth Buttons - Mobile, centered under links */}
                    <div className="w-full flex justify-center mt-2">
                        {auth ? <LoginHeader /> : <LoginButton />}
                    </div>
                </div>
            )}
        </nav>
    );
}