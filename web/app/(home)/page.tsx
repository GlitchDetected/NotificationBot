import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BsDiscord, BsYoutube } from "react-icons/bs";
import { HiArrowRight, HiChartBar, HiCheck, HiDocument, HiTerminal, HiTrash } from "react-icons/hi";
import { HiArrowNarrowRight } from "react-icons/hi";

import DiscordMessageEmbed from "@/components/discord/embed";
import { DiscordMarkdown } from "@/components/discord/markdown";
import DiscordMessage from "@/components/discord/message";
import Codeblock from "@/components/markdown/codeblock";
import { Badge } from "@/components/ui/badge";
import Box from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Marquee } from "@/components/ui/marquee";
import ScrollToTopButton from "@/components/ui/scroll-top";
import { Scrollwheel } from "@/components/ui/scrollwheel";
import ArrowPic from "@/public/arrow.webp";
import thumbnail from "@/public/assets/thumbnail.png";
import Grasspic from "@/public/backgrounds/grass.jpg";
import { cn } from "@/utils/cn";
import { handwritten, montserrat } from "@/utils/font";

import { Faq } from "./faq.component";
import Reviews from "./reviews.component";
import Topguilds from "./top-guilds.component";

const styles = {
    h2: cn(montserrat.className, "lg:text-5xl text-4xl bg-gradient-to-b bg-clip-text text-transparent from-red-900 from-40% to-red-500 font-bold mb-4"),
    h3: cn(montserrat.className, "lg:text-2xl text-xl bg-gradient-to-b bg-clip-text text-transparent from-red-900 from-40% to-red-500 font-semibold")
};

const messageProps = (command?: string) => ({
    mode: "DARK" as const,
    commandUsed: command
        ? {
            name: command,
            username: "@Panda1",
            avatar: "/user.webp",
            bot: false
        }
        : undefined,
    user: {
        username: "NotificationBot",
        avatar: "/bot.webp",
        bot: true
    }
});

const integrationsData = [
    {
        name: "YouTube",
        avatar: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
        content:
      "With placeholders like `video.title`, `video.uploaded.ago`, and `creator.subs`, NotificationBot will notify your server whenever a YouTube creator uploads."
    },
    {
        name: "Twitch",
        avatar: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Twitch_Glitch_Logo_Purple.svg",
        content:
      "We use `stream.title`, `stream.game`, and even `stream.live.since` to make stream notifications that feel personal and timely."
    },
    {
        name: "Reddit",
        avatar: "https://upload.wikimedia.org/wikipedia/en/8/82/Reddit_logo_and_wordmark.svg",
        content:
      "The bot pulls `post.title`, `post.flair`, and `author.username` so cleanly that our Reddit integration feels native."
    },
    {
        name: "Bluesky",
        avatar: "https://cdn.bsky.app/static/favicon.png",
        content:
      "`post.text`, `post.type`, and `creator.handle` let us deliver Bluesky posts right to Discord"
    }
];

const evenMoreContent = [
    {
        icon: HiDocument,
        title: "Vote",
        text: "Voting helps our bot grow!"
    },
    {
        icon: HiTrash,
        title: "Purge",
        text: "Use /purge to delete old notifications from the bot"
    },
    {
        icon: HiTerminal,
        title: "Rolling out new features",
        text: "We are constantly working on the bot"
    },
    {
        icon: HiTerminal,
        title: "Great support",
        text: "If you see any bugs, just use /support and we will fix the bug immediately"
    },
    {
        icon: HiTerminal,
        title: "Github notifications",
        text: "coming soon"
    },
    {
        icon: HiTerminal,
        title: "Global",
        text: "Used globally by many users"
    }
];

export default function Home() {
    return (
        <div className="flex flex-col items-center w-full">

            <div className="flex w-full items-center gap-8 mb-16 md:mb-12 min-h-[500px] h-[calc(100svh-14rem)] md:h-[calc(100dvh-16rem)]">
                <div className="md:min-w-96 w-full md:w-2/3 xl:w-1/2 flex flex-col space-y-6">
                    <h1 className={cn(montserrat.className, "lg:text-7xl md:text-6xl text-5xl font-semibold text-neutral-900 dark:text-neutral-100")}>
                        <span className="bg-gradient-to-r from-red-900 to-red-600 bg-clip-text text-transparent">
                            The Next generation
                        </span>{" "}
                        of{" "}
                        <span className="inline-flex items-center">
                            Discord Notifications
                        </span>
                    </h1>

                    <span className="text-lg font-medium max-w-[38rem] mb-4">
                        We introduce you to notifications from third party sources
                    </span>

                    <div className="space-y-4">
                        <Link href="/dashboard" className="flex items-center text-zinc-600 hover:underline">
                            Go to Dashboard <HiArrowNarrowRight className="ml-1" />
                        </Link>

                        <div className="flex flex-wrap gap-2">
                            <Button asChild>
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

                            <Button asChild>
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

                        <span className={cn("lg:ml-auto flex gap-2 text-neutral-500 font-medium opacity-80 pl-20 lg:pr-20 rotate-2 scale-110 relative pt-0.5", handwritten.className)}>
                            <Image
                                src={ArrowPic}
                                width={24}
                                height={24}
                                alt="arrow up"
                                className="h-5 w-5"
                                draggable={false}
                            />
                            Add NotificationBot to get started!
                        </span>
                    </div>
                </div>
            </div>

            <Topguilds />

            <Scrollwheel />

            <article
                itemScope
                itemType="http://schema.org/Article"
                className="flex flex-col gap-28 my-10"
            >
                <div>
                    <h2 className={styles.h2}>Platform Notifications 🔊</h2>
                    <Box className="flex flex-col md:flex-row gap-10 items-center">
                        <div className="md:w-1/2 flex flex-col items-start">
                            <Badge
                                className="mb-2"
                                variant="flat"
                                radius="rounded"
                            >
                                <HiCheck />
                                Supports up to 3 platforms
                            </Badge>

                            <h3 className={styles.h3}>Notifications from your favorite platforms</h3>

                            <div className="pt-6">
                                Setup notifications for your favorite sites like YouTube, TikTok, and Twitch—no slash commands needed!
                            </div>

                            <div className="flex gap-2 mt-5">
                                <Button asChild>
                                    <Link
                                        prefetch={false}
                                        href="https://youtu.be/NS5fZ1ltovE?si=I3nViYb4sx3n3Uvo"
                                        target="_blank"
                                    >
                                        <BsYoutube />
                                        Watch YouTube Video
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div
                            className="bg-discord-gray px-8 py-6 md:py-12 rounded-lg flex flex-col sm:flex-row sm:items-center md:flex-col md:items-start lg:flex-row lg:items-center gap-4 min-h-56"
                        >
                            <DiscordMessage {...messageProps()}>
                                <DiscordMarkdown
                                    mode="DARK"
                                    text={"Hey **@everyone**, MrBeast just uploaded a new video!\n[https://www.youtube.com/watch?v=0e3GPea1Tyg&vl](https://www.youtube.com/watch?v=0e3GPea1Tyg&vl)"}
                                />
                                <DiscordMessageEmbed mode="DARK" title="$456000 Squid Game in Real Life!" color={0xFF0000}>
                                    <Image
                                        alt=""
                                        className="rounded-md shadow-md w-full mt-2"
                                        itemProp="image"
                                        loading="lazy"
                                        src={thumbnail}
                                    />
                                </DiscordMessageEmbed>
                            </DiscordMessage>

                            <span className="text-sm mt-1 opacity-75">
                                Example message
                            </span>

                        </div>

                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>DM Notifications 🔊</h2>
                    <Box className="flex flex-col md:flex-row gap-10 items-center">
                        <div className="md:w-1/2 flex flex-col items-start">
                            <Badge
                                className="mb-2"
                                variant="flat"
                                radius="rounded"
                            >
                                <HiCheck />
                                Supports RSS
                            </Badge>

                            <h3 className={styles.h3}>Notifications sent right into your DMs</h3>

                            <div className="pt-6">
                                For this to work, just make sure <Codeblock>direct messages</Codeblock> is turned on!

                                <ol className="mt-4">
                                    {[
                                        "One configuration only for now"
                                    ].map((name) => (
                                        <li key={name} className="flex gap-1 items-center">
                                            <HiCheck className="text-red-400" />
                                            {name}
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            <div className="flex gap-2 mt-5">
                                <Button asChild>
                                    <Link
                                        prefetch={false}
                                        href="https://youtu.be/NS5fZ1ltovE?si=I3nViYb4sx3n3Uvo"
                                        target="_blank"
                                    >
                                        <BsYoutube />
                                        Watch YouTube Video
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div
                            className="bg-discord-gray px-8 py-6 md:py-12 rounded-lg flex flex-col sm:flex-row sm:items-center md:flex-col md:items-start lg:flex-row lg:items-center gap-4 min-h-56"
                        >
                            <DiscordMessage
                                mode={"DARK"}
                                user={{
                                    username: "Panda1",
                                    avatar: "/user.webp",
                                    bot: false
                                }}
                            >
                                <DiscordMarkdown mode={"DARK"} text="Demonstration below" />
                            </DiscordMessage>

                            <DiscordMessage {...messageProps()}>
                                <DiscordMarkdown
                                    mode="DARK"
                                    text={"Hey **@Panda1**, you have a new notification"}
                                />
                                <DiscordMessageEmbed mode="DARK" title="From: [https://rss.nytimes.com/services/xml/rss/nyt/World.xml](https://rss.nytimes.com/services/xml/rss/nyt/World.xml)" color={0xFF0000}>
                                    <Image
                                        alt=""
                                        className="rounded-md shadow-md w-full mt-2"
                                        itemProp="image"
                                        loading="lazy"
                                        src={thumbnail}
                                    />
                                </DiscordMessageEmbed>
                            </DiscordMessage>

                            <span className="text-sm mt-1 opacity-75">
                                Example message
                            </span>

                        </div>

                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Automatic Welcoming/Leaving Messages</h2>

                    <Box className="flex flex-col md:flex-row-reverse gap-10 items-center">
                        <div className="md:w-1/2">
                            <Badge
                                className="mb-2"
                                variant="flat"
                                radius="rounded"
                            >
                                <HiCheck />
                                includes custom backgrounds
                            </Badge>

                            <h3 className={styles.h3}>Greetings</h3>

                            <div className="pt-6">
                                Automatic messages for new and leaving members. Supports direct messages.
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Button asChild>
                                    <Link
                                        href="/dashboard?to=greeting"
                                        target="_blank"
                                    >
                                        <HiArrowRight />
                                        Setup
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="bg-discord-gray w-full md:w-1/2 px-8 py-4 rounded-lg">
                            <DiscordMessage {...messageProps()}>
                                <DiscordMarkdown mode={"DARK"} text="Welcome @user to **a very special server** 👋" />
                                <Image
                                    alt="example welcome card"
                                    src={Grasspic}
                                    height={(256 + 16) / 2}
                                    itemProp="image"
                                    loading="lazy"
                                    width={1024 / 2}
                                />
                            </DiscordMessage>
                        </div>
                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Create webhook messages 🖊️</h2>

                    <Box className="flex flex-col md:flex-row-reverse gap-10 items-center">
                        <div className="md:w-1/2">
                            <Badge
                                className="mb-2"
                                variant="flat"
                                radius="rounded"
                            >
                                <HiCheck />
                                Supports embeds for free
                            </Badge>

                            <h3 className={styles.h3}>Webhooks</h3>

                            <div className="pt-6">
                                Easily send a message with a webhook right in the dashboard!
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Button asChild>
                                    <Link
                                        href="/dashboard?to=custom-commands"
                                        target="_blank"
                                    >
                                        <HiArrowRight />
                                        Setup
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="bg-discord-gray w-full md:w-1/2 px-8 py-4 rounded-lg flex flex-col gap-4">
                            <DiscordMessage
                                mode={"DARK"}
                                user={{
                                    username: "Panda1",
                                    avatar: "/user.webp",
                                    bot: false
                                }}
                            >
                                <DiscordMarkdown mode={"DARK"} text="Below is a custom webhook message!" />
                            </DiscordMessage>

                            <DiscordMessage
                                mode={"DARK"}
                                user={{
                                    username: "NotificationBot",
                                    avatar: "/bot.webp",
                                    bot: true
                                }}
                            >
                                <DiscordMessageEmbed
                                    mode={"DARK"}
                                    color={0xFF0000}
                                >
                                    <DiscordMarkdown mode={"DARK"} text="custom message here!" />
                                </DiscordMessageEmbed>
                            </DiscordMessage>
                        </div>
                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Easily set up your server</h2>

                    <Box className="flex flex-col md:flex-row-reverse gap-10 items-center">
                        <div className="md:w-1/2">

                            <h3 className={styles.h3}>/serversetup</h3>

                            <div className="pt-6">
                                Easily set up your server{"'"}s notification channels and categories
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Button asChild>
                                    <Link
                                        href="/commands"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2"
                                    >
                                        <HiTerminal className="w-5 h-5" />
                                        More Commands
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="bg-discord-gray w-full md:w-1/2 px-8 py-4 rounded-lg">
                            <DiscordMessage {...messageProps("serversetup")}>
                                <DiscordMarkdown mode={"DARK"} text="Set up began..." />
                            </DiscordMessage>
                        </div>
                    </Box>
                </div>
            </article>

            <div className="text-center mb-16">
                <h2 className="text-xl font-bold">
                    <span className="text-red-900">Integrations </span>
                    with your favorite{" "}
                    <span className="text-red-500">platforms</span>
                </h2>

                <p className="mt-4 text-sm sm:text-md text-gray-400">
                    Never worry about sending manually sending out new notifications from your favorite platforms ever again!
                </p>
            </div>

            <div className="w-full my-16 px-4">
                <Marquee className="py-2" fade={true}>
                    {integrationsData.map((integration, i) => (
                        <Card key={i} className="w-80 mx-4 shrink-0">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Image
                                    src={integration.avatar}
                                    alt={integration.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                <CardTitle className="text-base">
                                    {integration.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                {integration.content}
                            </CardContent>
                        </Card>
                    ))}
                </Marquee>
            </div>


            <div className="max-w-7xl mx-auto px-20">
                <div className="relative flex justify-center items-center">
                    {evenMoreContent.map(({ icon: Icon }, index) => {
                        const rotation = 180 / (evenMoreContent.length - 1) * index;
                        return (
                            <div
                                key={index}
                                className="absolute"
                                style={{
                                    transform: `rotate(-${rotation}deg) translateX(120px) rotate(${rotation}deg)`
                                }}
                            >
                                <div className="flex justify-center items-center bg-zinc-700 rounded-full h-16 w-16">
                                    <Icon className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="text-center mb-20">
                    <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-900 to-red-500">
                        Countless more Features
                    </h2>
                    <p className="mt-4 text-sm sm:text-md text-gray-400">
                        We offer more than just notifications
                    </p>
                </div>

                <div className="grid w-full max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 px-4">
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

                    <Button className="flex justify-center" asChild>
                        <Link
                            href="/commands"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                        >
                            <HiTerminal className="w-5 h-5" />
                            More Commands
                        </Link>
                    </Button>
                </div>
            </div>


            <div className="w-full flex justify-center mb-12">
                <div className="bg-red-600 rounded-full h-16 w-16 flex items-center justify-center">
                    <HiChartBar className="h-8 w-8 text-white" />
                </div>
            </div>

            <div className="text-center mb-16 px-4">
                <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-900 to-red-500">
                    Highly trusted by server owners & staff
                </h2>
                <p className="mt-4 text-sm sm:text-md text-gray-400">We appreciate every feedback you give us!</p>
            </div>

            <div className="mb-24 w-full px-4">
                <Reviews />
            </div>

            <div className="mb-24 w-full px-4">
                <Faq />
            </div>

            <Card className="mb-32 max-w-xl w-full">
                <CardHeader>
                    <CardTitle>Enhance your community’s experience by 1000%</CardTitle>
                    <CardDescription>Get NotificationBot in your server today.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Button asChild>
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