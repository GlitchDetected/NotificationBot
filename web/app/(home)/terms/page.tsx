import { readFile } from "fs/promises";
import type { Metadata } from "next";

import CustomMarkdown from "@/components/markdown";
import { getBaseUrl, getCanonicalUrl } from "@/lib/urls";

export const revalidate = false;

export const generateMetadata = (): Metadata => {

    const title = "Terms of Service";
    const description = "Read about NotificationBot's Terms of Service.";
    const url = getCanonicalUrl("terms");

    return {
        title,
        description,
        alternates: {
            canonical: url
        },
        openGraph: {
            title,
            description,
            type: "website",
            url,
            images: `${getBaseUrl()}/images/notificationbot.png`
        },
        twitter: {
            card: "summary",
            site: "notificationbot.xyz",
            title,
            description,
            images: `${getBaseUrl()}/images/notificationbot.png`
        }
    };
};

const PATH = `${process.cwd()}/public/legal/terms.md` as const;

export default async function Home() {
    const terms = await readFile(PATH, { encoding: "utf-8" });
    return <CustomMarkdown markdown={terms} />;
}