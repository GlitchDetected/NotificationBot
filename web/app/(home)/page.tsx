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
