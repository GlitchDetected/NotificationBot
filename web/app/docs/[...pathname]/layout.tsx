import type { Metadata } from "next";
import Link from "next/link";
import { BsDiscord, BsGithub } from "react-icons/bs";
import { HiUserAdd, HiViewGridAdd } from "react-icons/hi";

import Footer from "@/components/Footer";
import { LinkButton } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import metadata from "@/public/docs/meta.json";
import { getBaseUrl, getCanonicalUrl } from "@/lib/urls";

interface Props {
    params: Promise<{ pathname: string[]; }>;
    children: React.ReactNode;
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { pathname } = await params;
    const meta = metadata.pages.find((page) => page.file === `${pathname.join("/").toLowerCase()}.md`);

    const title = meta?.file === "home.md"
        ? "Documentation"
        : `${meta?.name} docs`;

    const url = getCanonicalUrl("docs", ...pathname);
    const images = {
        url: meta?.image || `${getBaseUrl()}/images/notificationbot.png`,
        alt: meta?.description,
        heigth: 1008,
        width: 1935
    };

    return {
        title,
        description: meta?.description,
        alternates: {
            canonical: url
        },
        openGraph: {
            title,
            description: meta?.description,
            url,
            type: "article",
            images
        },
        twitter: {
            card: "summary_large_image",
            title,
            description: meta?.description,
            images
        }
    };
};

export default async function RootLayout({ params, children }: Props) {
    const { pathname } = await params;
    const meta = metadata.pages.find((page) => page.file === `${pathname.join("/").toLowerCase()}.md`);

    const title = meta?.file === "home.md"
        ? "NotificationBot"
        : meta?.name;

    return (
        <div className="w-full mb-20 mt-30">

            <h1 className="text-2xl font-medium text-neutral-100 mb-1">
                {title} Documentation
            </h1>
            <div>
                {meta?.description}
            </div>

            <div className="flex flex-col lg:flex-row gap-6 mt-5 min-h-[63vh]">
                <nav className="w-full lg:w-1/4 space-y-2">

                    <ul className="space-y-1 mb-4 bg-red p-2 rounded-md border border-red-600">
                        {metadata.pages.map((page, i) =>
                            <NavButton
                                key={"nav-" + page.file + i}
                                page={page}
                            />
                        )}
                    </ul>

                    <LinkButton
                        className="w-full !justify-start"
                        href="/support"
                        target="_blank"
                        variant="blurple"
                    >
                        <BsDiscord />
                        Join Support
                    </LinkButton>
                    <LinkButton
                        className="w-full !justify-start"
                        href="/invite"
                        target="_blank"
                        variant="secondary"
                    >
                        <HiUserAdd />
                        Invite NotificationBot
                    </LinkButton>
                    <LinkButton
                        className="w-full !justify-start"
                        href="/profile"
                        target="_blank"
                    >
                        <HiViewGridAdd />
                        Dashboard
                    </LinkButton>
                    <Link
                        className="flex items-center gap-1.5 hover:text-red-400 duration-100"
                        href={"https://github.com/glitchdetected/notificationbot"}
                        target="_blank"
                    >
                        <BsGithub /> Contribute
                    </Link>
                </nav>

                <Separator className="lg:hidden" />

                {children}
            </div>

            <Footer className="mt-24" />
        </div>
    );
}

function NavButton({
    page
}: {
    page: typeof metadata.pages[0];
}) {
    const file = page.file.replace(/\.md$/, "");
    const icon = page.name.split(" ").shift() || "";
    const name = page.name.replace(icon, "");

    return (
        <li>
            <LinkButton
                className="w-full !justify-start bg-transparent h-[30px]"
                href={`/docs/${file}`}
                size="sm"
            >
                <span className="mr-[2px]">
                    {icon}
                </span>
                {name}
            </LinkButton>
        </li>
    );
}