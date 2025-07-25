import "./markdown.css";

import * as md from "@odiffey/discord-markdown";

import { cn } from "@/utils/cn";

export function DiscordMarkdown({
    text,
    mode,
    embed = true
}: {
    text: string;
    mode: "DARK" | "LIGHT";
    embed?: boolean;
}) {
    const sanitizedHtml = text.replaceAll("\\n", "\n").trim();

    return (
        <div
            className={cn("discord-md", mode === "LIGHT" && "discord-md-light")}
            dangerouslySetInnerHTML={{ __html: md.toHTML(sanitizedHtml, { embed }) }}
        />
    );
}