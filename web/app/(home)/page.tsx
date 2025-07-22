"use client";

import { CodeIcon, EraserIcon, GearIcon, GlobeIcon, HeartIcon, RocketIcon, SpeakerLoudIcon } from "@radix-ui/react-icons";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Patrick_Hand } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { BsDiscord } from "react-icons/bs";
import { HiArrowNarrowRight } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle } from "@/components/ui/card";
import ScrollToTopButton from "@/components/ui/scroll-top";
import { Scrollwheel } from "@/components/ui/scrollwheel";
import ArrowPic from "@/public/arrow.webp";
import { cn } from "@/utils/cn";

import { Faq } from "./faq.component";

const handwritten = Patrick_Hand({ subsets: ["latin"], weight: "400" });

const evenMoreContent = [
    {
        icon: RocketIcon,
        title: "Growing support for third-party platforms",
        text: "We currently support notifications from YouTube, Twitch, and Twitch but that will change"
    },
    {
        icon: EraserIcon,
        title: "Purge",
        text: "Use /purge to delete old notifications from the bot"
    },
    {
        icon: CodeIcon,
        title: "Rolling out new features",
        text: "We are constantly working on the bot"
    },
    {
        icon: SpeakerLoudIcon,
        title: "Great support",
        text: "If you see any bugs, just use /support and we will fix the bug immediately"
    },
    {
        icon: GearIcon,
        title: "Github notifications",
        text: "coming soon"
    },
    {
        icon: GlobeIcon,
        title: "Global",
        text: "Used globally by many users"
    }
];

const content = [
    {
        icon: RocketIcon,
        title: "1",
        text: "1"
    },
    {
        icon: EraserIcon,
        title: "2",
        text: "2"
    },
    {
        icon: CodeIcon,
        title: "3",
        text: "3"
    },
    {
        icon: SpeakerLoudIcon,
        title: "4",
        text: "4"
    },
    {
        icon: GearIcon,
        title: "5",
        text: "5"
    },
    {
        icon: GlobeIcon,
        title: "6",
        text: "6"
    }
];

export default function Home() {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
    };

    const targetRef = useRef<HTMLDivElement | null>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);
    const y = useTransform(scrollYProgress, [0.8, 1], ["0vh", "50vh"]);

    const numberOfIcons = content.length;
    const angle = 180 / (numberOfIcons - 1);

    const isInView = useInView(targetRef, { once: true, margin: "-100px" });

    return (
        <div
            className="relative flex items-center flex-col w-full p-8 min-h-screen px-5 md:px-8 lg:px-12 xl:px-16 py-8 z-10"
        >
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

                        <div className="flex space-x-4 mt-20">
                            <Button>
                                <Link
                                    href="https://discord.com/oauth2/authorize?client_id=1366507117044957276"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    Invite NotificationBot
                                </Link>
                            </Button>

                            <Button>
                                <Link
                                    href="https://discord.gg/QnZcYsf2E9"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2"
                                >
                                    <BsDiscord className="w-5 h-5" />
                                    Support Server
                                </Link>
                            </Button>
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
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Third Party Posts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        With NotificationBot, you can easily setup notifications for your favorite sites like YouTube, TikTok, and
                        Twitch just from the dashboard. No slash commands needed!
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>RSS Notifications</CardTitle>
                    </CardHeader>
                    <CardContent>RSS and content feed updates</CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Custom announcements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        Easily send custom announcements from your server&apos;s NotificationBot dashboard
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>/Purge</CardTitle>
                    </CardHeader>
                    <CardContent>
                        Delete old announcements with /purge or use the dashboard instead!
                    </CardContent>
                </Card>

                <div className="col-span-full flex justify-center button-link">
                    <Link href="/commands">
                        <button className="button">More Commands</button>
                    </Link>
                </div>
            </motion.div>
            <Scrollwheel />
            <motion.section
                ref={targetRef}
                style={{ opacity, y }}
                className="mx-auto w-full max-w-[120rem] py-24 sm:py-32 lg:py-40 mt-20"
            >
                <div className="relative flex justify-center items-center mb-16">
                    {content.map(({ icon: Icon }, index) => {
                        const rotation = angle * index;
                        return (
                            <div
                                key={index}
                                className="absolute"
                                style={{
                                    transform: `rotate(-${rotation}deg) translateX(120px) rotate(${rotation}deg)`
                                }}
                            >
                                <div className="flex justify-center items-center bg-zinc-700 rounded-full h-16 w-16">
                                    <Icon className="h-8 w-8" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-900 to-red-500">
                        Countless more Features
                    </h2>
                    <p className="mt-4 text-sm sm:text-md text-gray-400">
                        Never worry manually sending announcements for everything. NotificationBot has got you covered for that!
                    </p>
                </div>

                <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
                    {evenMoreContent.map(({ icon: Icon, title, text }) => (
                        <Card key={title} className="text-center relative">
                            <span className="absolute top-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                                <Icon className="h-8 w-8" />
                            </span>
                            <CardHeader className="mt-16">
                                <CardTitle>{title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{text}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </motion.section>
            <motion.section
                ref={targetRef}
                className="mx-auto w-full max-w-[120rem] py-24 sm:py-32 lg:py-40 mt-20 mb-20"
                variants={fadeIn}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                <div className="w-full flex justify-center mb-16">
                    <div className="bg-red-600 rounded-full h-16 w-16 flex items-center justify-center">
                        <HeartIcon className="h-8 w-8" />
                    </div>
                </div>

                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-900 to-red-500">
                        Highly trusted by server owners & staff
                    </h2>
                    <p className="mt-4 text-sm sm:text-md text-gray-400">We appreciate every feedback you give us!</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
                    {content.map(({ icon: Icon, title, text }, index) => (
                        <Card
                            key={title}
                            className={`text-center relative ${
                                index === 0 || index === 5 ? "h-[400px]" : "h-[300px]"
                            }`}
                        >
                            <span className="absolute top-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                                <Icon className="h-8 w-8" />
                            </span>
                            <CardHeader className="mt-16">
                                <CardTitle>{title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{text}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </motion.section>
            <Faq />

            <Card>
                <CardHeader>
                    <CardTitle>
                        Enhance your community’s experience by 1000%.
                    </CardTitle>
                    <CardDescription>
                        Get NotificationBot in your server today.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="mx-auto" asChild>
                        <Link href="/profile" target="_blank">
                            Get Started
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            <ScrollToTopButton />
        </div>
    );
}