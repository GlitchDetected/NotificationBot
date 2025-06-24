"use client";

import { BsDiscord } from "react-icons/bs";
import { HiArrowNarrowRight } from "react-icons/hi";
import Link from "next/link";
import { Sparkles, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedBorderTrail from "@/components/animata/container/animated-border-trail";
import { useSectionInView } from "@/lib/hooks";
import ScrollToTopButton from "@/components/buttons/ScrollToTopButton";
import { MoreFeatures } from "@/components/homepage/evenmore";
import { Faq } from "@/components/homepage/faq";
import ArrowPic from "@/public/icons/arrow.webp";
import { cn } from "@/lib/utils";
import { Content, Montserrat, Patrick_Hand } from "next/font/google";
import Image from "next/image";
import { Getstarted } from "@/components/homepage/getstarted";
import { Reviews } from "@/components/homepage/reviews";

const montserrat = Montserrat({ subsets: ["latin"] });
const handwritten = Patrick_Hand({ subsets: ["latin"], weight: "400" });

// Define animations for motion
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const styles = {
  h2: "text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-cyan-700 mb-6",
  h3: "text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-b from-neutral-200 to-neutral-300 mb-6",
  cardStyle: "md:w-2/3 p-8 bg-slate-900 rounded-lg shadow-lg hover:shadow-2xl transition-shadow"
};

export default function Home() {
  const { ref } = useSectionInView("Home");

  return (
    <div
      className="relative flex items-center flex-col w-full p-8 min-h-screen px-5 md:px-8 lg:px-12 xl:px-16 py-8 z-10"
      id="home"
      ref={ref}
    >
      <motion.div
        className="flex w-full items-center gap-3 mb-20 mt-19"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="w-full md:w-2/3 xl:w-1/2 flex flex-col space-y-6">
          <h1 className="text-5xl font-semibold">
            <span className="bg-gradient-to-r from-red-900 to-red-500 bg-clip-text text-transparent">
              The Next generation
            </span>
            {" of "}
            <span className="inline-flex items-center">notifications</span>
          </h1>
          <p className="text-lg mb-4">Notify your community more easily!</p>

          <div className="space-y-4">
            <Link href="/dashboard" className="flex items-center text-zinc-600 hover:underline">
              Go to Dashboard <HiArrowNarrowRight />
            </Link>

            <div className="button-row">
              <div className="button-link">
                <Link href="https://discord.com/oauth2/authorize?client_id=1237878380838523001">
                  <button className="button flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Invite NotificationBot
                  </button>
                </Link>
              </div>

              <div className="button-link">
                <Link href="https://discord.gg/QnZcYsf2E9">
                  <button className="button flex items-center gap-2">
                    <BsDiscord className="w-5 h-5" />
                    Support Server
                  </button>
                </Link>
              </div>
            </div>
            <span
              className={cn(
                "lg:ml-auto flex gap-2 text-neutral-500 font-medium -mt-2 opacity-80 pl-20 lg:pr-20 rotate-2 relative -top-10",
                handwritten.className
              )}
            >
              <Image
                src={ArrowPic}
                width={24}
                height={24}
                alt="arrow up"
                className="h-5 w-5 relative top-px"
                draggable={false}
              />
              Get started here in seconds
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="card">
          <h3>Filters</h3>
          <p>Keep any chat clean with our many automated filtering options.</p>
        </div>

        <div className="card">
          <h3>Fake Permissions</h3>
          <p>Remove all dangerous Discord permissions that can be used for malicious reasons through API.</p>
        </div>

        <div className="card">
          <h3>Anti-nuke</h3>
          <p>
            Easily prevent your server from malicious attacks and griefing, with a customizable threshold set by you.
          </p>
        </div>

        <div className="card">
          <h3>Anti-raid</h3>
          <p>
            Protect against targeted bot raids on your server, with our mass join, avatar and account age anti-raid
            filters.
          </p>
        </div>
      </motion.div>

      <div className="button-link">
        <AnimatedBorderTrail
          className="rounded-full bg-red-950 hover:bg-red-300"
          contentClassName="rounded-full bg-zinc-800"
          trailColor="white"
        >
          <Link href="/commands">
            <button className="button">More Commands</button>
          </Link>
        </AnimatedBorderTrail>
      </div>

      <div className="flex flex-col items-center space-x-2">
        <div className="animate-scroll rounded-lg rotate-180 md:rounded-3xl md:rotate-0">
          <div className="animate-scroll-wheel" />
        </div>
        <span className="hidden md:block text-lg font-medium mt-2 text-neutral-500/50">Keep scrolling</span>
      </div>
      <MoreFeatures />
      <Reviews />
      <Faq />
      <Getstarted />

      <ScrollToTopButton />
    </div>
  );
}
