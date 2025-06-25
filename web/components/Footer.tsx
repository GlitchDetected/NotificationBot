import Link from "next/link";
import { HiBookOpen, HiCloud, HiCube, HiHand, HiLibrary, HiUserAdd } from "react-icons/hi";
import { BiCopyright, BiLogoGithub, BiLogoGmail, BiLogoReddit, BiLogoTiktok, BiLogoYoutube } from "react-icons/bi";
import { BsDiscord } from "react-icons/bs";
import TopggIcon from "@/components/icons/topgg";
import type { HTMLProps } from "react";
import { cn } from "@/lib/utils";

export default function Footer(props: HTMLProps<HTMLDivElement>) {
  return (
    <footer className="w-full h-px bg-gray-700 mb-6">

        <div
            className={cn("text-primary/75 w-full mt-10 text-left", props.className)}
            {...props}
        >

                    <div className="flex items-center gap-1 font-semibold">
                <BsDiscord className="relative top-[1px] text-red-900" />
                <span className="text-xl bg-gradient-to-r from-red-900 to-red-400 bg-clip-text text-transparent">NotificationBot</span>
                <span className="text-xl bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">for</span>
                <span className="text-xl bg-gradient-to-r from-amber-400 to-orange-700 bg-clip-text text-transparent">Discord</span>
            </div>

                        <div className="flex flex-col md:flex-row gap-6 md:gap-2 justify-between">
                <div>
        <div className="mb-3 dark:text-neutral-400 text-neutral-600">

                                <span className="flex gap-1 items-center">
                            <BiCopyright />
                            <span>
                                <Link href="/" className="hover:underline">NotificationBot {new Date(1635609600000).getFullYear()} - {new Date().getFullYear()}</Link>,
                            </span>
                        </span>

         <span className="flex gap-1 items-center">
           <HiCube/>
        <span className="flex items-center">
          <span>Made by GlitchDetected</span>
        </span>
        </span>
        </div>

        <FooterSocials />
        </div>

        <FooterLinks />
      </div>
       </div>
    </footer>
  );
}

function FooterSocials() {
    return (
        <div className="ml-auto svg-max flex flex-wrap items-center gap-2 mt-2 md:mt-0">
            <Link href="https://github.com/glitchdetected" className="text-white/75 hover:text-white duration-200 size-6" aria-label="Wamellow's developers on GitHub">
                <BiLogoGithub />
            </Link>
            <Link href="mailto:example.com" className="text-white/75 hover:text-white duration-200 size-6" aria-label="Contact Wamellow via email">
                <BiLogoGmail />
            </Link>
            <Link href="/vote" className="text-[#ff3366] duration-200 size-6" aria-label="Vote for NotificationBot on top.gg">
                <TopggIcon />
            </Link>
        </div>
    );
}

function FooterLinks() {
    return (
        <div className="flex gap-12 dark:text-neutral-400 text-neutral-600 select-none">
            <div>
                <div className="font-medium dark:text-neutral-200 text-neutral-800 mb-1">Legal stuff</div>
                <Link
                    className="text-primary/75 hover:text-primary/65 duration-200 flex items-center gap-2"
                    href="/terms"
                >
                    <HiLibrary />
                    Terms of Service
                </Link>
                <Link
                    className="text-primary/75 hover:text-primary/65 duration-200 flex items-center gap-2"
                    href="/privacy"
                >
                    <HiHand />
                    Privacy Policy
                </Link>
            </div>
            <div>
                <div className="font-medium dark:text-neutral-200 text-neutral-800 mb-1">Links</div>
                <Link
                    className="text-primary/75 hover:text-primary/65 duration-200 flex items-center gap-2"
                    href="/support"
                >
                    <BsDiscord />
                    Support
                </Link>
                <Link
                    className="text-primary/75 hover:text-primary/65 duration-200 flex items-center gap-2"
                    href="/docs"
                >
                    <HiBookOpen />
                    Documentation
                </Link>
                <Link
                    className="text-primary/75 hover:text-primary/65 duration-200 flex items-center gap-2"
                    href="/status"
                >
                    <HiCloud />
                    Status
                </Link>
                <Link
                    className="text-primary/75 hover:text-primary/65 duration-200 flex items-center gap-2"
                    href="/invite"
                    prefetch={false}
                >
                    <HiUserAdd />
                    Invite
                </Link>
            </div>
        </div>
    );
}