"use client";

import React from "react";
import { BsChat, BsReddit, BsTwitch, BsYoutube } from "react-icons/bs";

import Codeblock from "@/components/markdown/codeblock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Marquee } from "@/components/ui/marquee";

const integrationsData = [
    {
        name: "YouTube",
        icon: BsYoutube,
        content:
      "With placeholders like `video.title`, `video.uploaded.ago`, and `creator.subs`, NotificationBot will notify your server whenever a YouTube creator uploads."
    },
    {
        name: "Twitch",
        icon: BsTwitch,
        content:
      "We use `stream.title`, `stream.game`, and even `stream.live.since` to make stream notifications that feel personal and timely."
    },
    {
        name: "Reddit",
        icon: BsReddit,
        content:
      "The bot pulls `post.title`, `post.flair`, and `author.username` so cleanly that our Reddit integration feels native."
    },
    {
        name: "Bluesky",
        icon: BsChat,
        content:
      "`post.text`, `post.type`, and `creator.handle` let us deliver Bluesky posts right to Discord."
    }
];

export default function IntegrationsMarquee() {
    // Helper: render text with <Codeblock> for backtick sections
    const renderTextWithCode = (text: string) => {
        const parts = text.split(/(`[^`]+`)/g);
        return parts.map((part, i) => {
            if (part.startsWith("`") && part.endsWith("`")) {
                const code = part.slice(1, -1);
                return <Codeblock key={i}>{code}</Codeblock>;
            }
            return <span key={i}>{part}</span>;
        });
    };

    return (
        <div className="w-full my-16 px-4">
            <Marquee className="py-2" fade pauseOnHover>
                {integrationsData.map((integration, i) => (
                    <Card key={i} className="w-80 mx-4 shrink-0">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <integration.icon className="w-10 h-10 text-red-500" />
                            <CardTitle className="text-base">{integration.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-400">
                            {renderTextWithCode(integration.content)}
                        </CardContent>
                    </Card>
                ))}
            </Marquee>
        </div>
    );
}