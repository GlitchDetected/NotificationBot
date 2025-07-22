"use client";

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
                    Open Discord{"'"}s add-app flow at <LinkTag href="/add">notificationbot.xyz/add</LinkTag>.
                </li>
                <li>
                    Select a server and click on {"\""}Continue{"\""}.
                </li>
                <li>
                    Do <span className="font-semibold">not uncheck</span> any permissions (or the bot will malfunction) and click
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
                It is free but there are limitations for how many notification channels you can have{" "}
                <LinkTag href="/vote">vote for NotificationBot on top.gg</LinkTag> if you start using it a lot.
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
        title: "log system coming soon?",
        content: <div itemProp="text">yes. i promise</div>
    }
];

interface Props {
    showTitle?: boolean;
}

export function Faq({ showTitle = false }: Props) {
    return (
        <div className="my-4 w-full" itemType="https://schema.org/FAQPage" itemScope>
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