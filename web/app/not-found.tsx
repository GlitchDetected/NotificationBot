"use client";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import Notfound from "@/public/images/notfound.png";

export default function NotFound() {
    const [hover, setHover] = useState(false);
    const [showBoom, setShowBoom] = useState(true); // State to control visibility of the boom element

    useEffect(() => {
    // Set a timer to hide the boom after animation completes (6 seconds)
        const timer = setTimeout(() => {
            setShowBoom(false);
        }, 5000);

        return () => clearTimeout(timer); // Clean up timer on unmount
    }, []);
    return (
        <div className="flex flex-col justify-center items-center h-screen not-found">
            <div className="text-center max-w-lg">
                <Image
                    src={Notfound}
                    alt="Not Found"
                    height={141 * 1.5}
                    width={124 * 1.5}
                    style={{
                        margin: "auto"
                    }}
                    unoptimized
                />

                <p className="text-xl mb-6 mono-font">The page you are looking for has exploded</p>

                <div className="mb-6">
                    <div
                        className={`text-6xl mb-4 transition-transform duration-500 ${hover ? "rotate-360" : "rotate-0"}`}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                    />
                </div>

                <Link
                    href="/"
                    className="bg-gray-900 py-3 px-6 rounded-lg text-lg hover:bg-gray-950 transition-all flex items-center justify-center"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    Homepage
                    <ArrowRight
                        className={`ml-2 h-4 w-4 transition-transform duration-300 ${hover ? "translate-x-1" : "translate-x-0"}`}
                        strokeWidth={3}
                    />
                </Link>
            </div>

            {showBoom && <div id="boom"></div>}
        </div>
    );
}