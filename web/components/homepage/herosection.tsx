import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Patrick_Hand } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";
import { HiArrowNarrowRight } from "react-icons/hi";

import ArrowPic from "@/public/icons/arrow.webp";
import { cn } from "@/utils/cn";

const handwritten = Patrick_Hand({ subsets: ["latin"], weight: "400" });

export function Herosection() {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
    };

    return (
        <motion.div className="flex w-full items-center gap-3" initial="hidden" animate="visible" variants={fadeIn}>
            <div className="w-full md:w-2/3 xl:w-1/2 flex flex-col space-y-6">
                <h1 className="text-5xl font-semibold">
                    <span className="bg-gradient-to-r from-red-900 to-red-500 bg-clip-text text-transparent">
                        The Next generation
                    </span>
                    {" of "}
                    <span className="inline-flex items-center">notifications</span>
                </h1>
                <p className="text-lg mb-4">It has never been easier to notify your community until now...</p>

                <div className="space-y-4">
                    <Link href="/dashboard" className="flex items-center text-zinc-600 hover:underline">
                        Go to Dashboard <HiArrowNarrowRight />
                    </Link>

                    <div className="button-row">
                        <div className="button-link">
                            <Link href="https://discord.com/oauth2/authorize?client_id=1366507117044957276">
                                <button className="button flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    Invite NotificationBot
                                </button>
                            </Link>
                        </div>

                        <div className="button-link">
                            <Link href="https://discord.gg/QnZcYsf2E9">
                                <button className="button flex items-center gap-2">
                                    <BsDiscord className="w-5 h-5" />
                                    Support Server
                                </button>
                            </Link>
                        </div>
                    </div>
                    <span
                        className={cn(
                            "lg:ml-auto flex gap-2 text-neutral-500 font-medium -mt-2 opacity-80 pl-20 lg:pr-20 rotate-2 relative -top-10",
                            handwritten.className
                        )}
                    >
                        <Image
                            src={ArrowPic}
                            width={24}
                            height={24}
                            alt="arrow up"
                            className="h-5 w-5 relative top-px"
                            draggable={false}
                        />
                        Add NotificationBot to get started!
                    </span>
                </div>
            </div>
        </motion.div>
    );
}