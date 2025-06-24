"use client";

import { useSectionInView } from "@/lib/hooks";

import { Herosection } from "@/components/homepage/herosection";
import { Corefeatures } from "@/components/homepage/corefeatures";
import { Scrollwheel } from "@/components/homepage/scrollwheel";
import { MoreFeatures } from "@/components/homepage/evenmore";
import { Reviews } from "@/components/homepage/reviews";
import { Faq } from "@/components/homepage/faq";
import { Getstarted } from "@/components/homepage/getstarted";
import ScrollToTopButton from "@/components/buttons/ScrollToTopButton";

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
      <Herosection/>
      <Corefeatures/>
      <Scrollwheel/>
      <MoreFeatures />
      <Reviews />
      <Faq />
      <Getstarted />

      <ScrollToTopButton />
    </div>
  );
}
