"use client";

import { isValidElement } from "react";
import { HiBell, HiCash, HiChat, HiUserAdd } from "react-icons/hi";

import Codeblock from "@/components/markdown/codeblock";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import LinkTag from "@/components/ui/link-tag";
import { Section } from "@/components/ui/section";

const data = [
    {
        startContent: <HiUserAdd />,
        title: "How do I invite NotificationBot to my Server?",
        subtitle: "Invite NotificationBot to your server to get started!",
        content: (
            <ol className="list-decimal list-inside marker:text-neutral-500" itemProp="text">
                <li>
                    Be sure to have the <Codeblock>Manage Server</Codeblock> permission on the server you want{" "}
                    <LinkTag href="/add">invite NotificationBot</LinkTag> into.
                </li>
                <li>
                    Open Discord{"'"}s add-app flow at <LinkTag href="/add">/add</LinkTag>.
                </li>
                <li>
                    Select a server and click on {"\""}Continue{"\""}.
                </li>
                <li>
                    <span className="font-semibold">DO NOT UNCHECK</span> any permissions and click
                    on {"\""}Authorize{"\""}.
                </li>
                <li>
                    <span className="font-semibold">Done!</span> You should now find yourself on the Dashboard for your server!
                </li>
            </ol>
        )
    },
    {
        startContent: <HiCash />,
        title: "Is the notification system free to use?",
        content: (
            <div>
                It is free for now but I might add some paid features in the future{" "}
                <LinkTag href="/vote">give NotificationBot a vote on top.gg</LinkTag>!
            </div>
        )
    },
    {
        startContent: <HiChat />,
        title: "How do I set up the Notifications system?",
        content: (
            <div itemProp="text">
                <ol className="list-decimal list-inside marker:text-neutral-500 mb-4">
                    <li>
                        <LinkTag href="/add">Invite NotificationBot</LinkTag> to your server
                    </li>
                    <li>
                        Go to the <LinkTag href="/profile">Dashboard</LinkTag>, find your server and click {"\""}manage{"\""}.
                    </li>
                    <li>
                        Go to the tab that says {"\""}Third Party Notifications{"\""}
                    </li>
                    <li>
                        <span className="font-semibold">Fill in the placeholders and you it will start notifying you🎉</span>
                    </li>
                </ol>
                You can also watch the video tutorial below or{" "}
                <LinkTag href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">watch it on YouTube</LinkTag>.
                <iframe
                    className="mt-2 aspect-video rounded-lg"
                    width="100%"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="NotificationBot Ranking system"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
            </div>
        )
    },
    {
        startContent: <HiBell />,
        title: "How can I support the developer",
        content: <div itemProp="text">You can boost our discord server or give the bot a vote on top.gg</div>
    }
];

const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.map((item) => ({
        "@type": "Question",
        name: item.title,
        acceptedAnswer: {
            "@type": "Answer",
            text: extractText(item.content)
        }
    }))
};

export function Faq({
    showTitle = false
}: {
    showTitle?: boolean;
}) {
    return (
        <div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(schema)
                }}
            />
            {showTitle ? (
                <Section className="mb-4" title="Frequently Asked Questions about NotificationBot">
                    Commonly asked questions about NotificationBot and how to use it.
                </Section>
            ) : (
                <b className="sr-only">Frequently Asked Questions for NotificationBot</b>
            )}

            <Accordion type="single" collapsible className="w-full" defaultValue={data[0].title}>
                {data.map((item) => (
                    <AccordionItem key={item.title} value={item.title}>
                        <AccordionTrigger>{item.title}</AccordionTrigger>
                        <AccordionContent className="text-sm leading-relaxed">
                            {item.content}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}

function extractText(content: React.ReactNode): string {
    if (typeof content === "string") return content;
    if (typeof content === "number") return content.toString();

    if (isValidElement(content)) {
        if ((content.props as React.PropsWithChildren).children) {
            return extractText((content.props as React.PropsWithChildren).children);
        }
    }
    if (!Array.isArray(content)) return "";

    return content
        .map((child) => extractText(child))
        .join(" ");
}