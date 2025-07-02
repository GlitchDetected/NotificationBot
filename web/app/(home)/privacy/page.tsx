import { readFile } from "fs/promises";
import type { Metadata } from "next";

import CustomMarkdown from "@/components/markdown";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";

export const revalidate = false;

export const generateMetadata = (): Metadata => {

    const title = "Privacy";
    const description = "Read about NotificationBot's privacy policy";
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

const PATH = `${process.cwd()}/public/legal/privacy.md` as const;

export default async function Home() {
    const privacy = await readFile(PATH, { encoding: "utf-8" });
    return <CustomMarkdown markdown={privacy} />;
}