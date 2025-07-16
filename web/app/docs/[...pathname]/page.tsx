import { readFile } from "fs/promises";

import { Faq } from "@/app/(home)/faq.component";
import CustomMarkdown from "@/components/markdown";
import Codeblock from "@/components/markdown/codeblock";
import Notice, { NoticeType } from "@/components/notice";
import { HomeButton, ScreenMessage, SupportButton } from "@/components/screen-message";
import metadata from "@/public/docs/meta.json";

interface Props {
    params: Promise<{ pathname: string[]; }>;
}

const PATH = `${process.cwd()}/public/docs` as const;

export default async function Home({ params }: Props) {
    const { pathname } = await params;
    const markdown = await readFile(`${PATH}/${pathname.join("/").toLowerCase()}.md`, "utf-8").catch(() => null);
    const meta = metadata.pages.find((page) => page.file === `${pathname.join("/").toLowerCase()}.md`);

    if (!markdown || !meta) {
        return (
            <ScreenMessage
                top="6rem"
                title="Sadly, this page can not be found.."
                description="Seems like you got a little lost here?"
                buttons={
                    <>
                        <HomeButton />
                        <SupportButton />
                    </>
                }
            ></ScreenMessage>
        );
    }

    return (
        <article itemType="http://schema.org/Article" className="w-full lg:w-3/4">
            {meta?.permissions?.bot && (
                <Notice type={NoticeType.Info} message="NotificationBot requries permission:" location="bottom">
                    <div className="flex flex-wrap gap-1">
                        {meta.permissions.bot.map((perm) => (
                            <Codeblock key={perm}>
                                {perm}
                            </Codeblock>
                        ))}
                    </div>
                </Notice>
            )}

            <CustomMarkdown markdown={markdown} />

            <div className="h-16" />

            <Faq showTitle />
        </article>
    );
}