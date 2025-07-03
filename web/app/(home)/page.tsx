"use client";

import { Corefeatures } from "@/components/homepage/corefeatures";
import { MoreFeatures } from "@/components/homepage/evenmore";
import { Faq } from "@/components/homepage/faq";
import { Getstarted } from "@/components/homepage/getstarted";
import { Herosection } from "@/components/homepage/herosection";
import { Reviews } from "@/components/homepage/reviews";
import { Scrollwheel } from "@/components/homepage/scrollwheel";
import ScrollToTopButton from "@/components/ui/scroll-top";
import { useSectionInView } from "@/lib/hooks";

export default function Home() {
    const { ref } = useSectionInView("Home");

    return (
        <div
            className="relative flex items-center flex-col w-full p-8 min-h-screen px-5 md:px-8 lg:px-12 xl:px-16 py-8 z-10"
            id="home"
            ref={ref}
        >
            <Herosection />
            <Corefeatures />
            <Scrollwheel />
            <MoreFeatures />
            <Reviews />
            <Faq />
            <Getstarted />

            <ScrollToTopButton />
        </div>
    );
}