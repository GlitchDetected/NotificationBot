/* eslint-disable react-hooks/refs */
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

import {
    Tabs,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import decimalToRgb from "@/utils/decimalToRgb";

interface ListProps {
    tabs: {
        name: string;
        icon?: React.ReactElement;
        value: string;
    }[];
    url: string;
    searchParamName?: string;
    disabled: boolean;
    children?: React.ReactNode;
}

export function ListTab({ tabs, url, searchParamName, disabled }: ListProps) {
    const [position, setPosition] = useState(0);
    const path = usePathname();
    const params = useSearchParams();
    const router = useRouter();
    const ref = useRef<HTMLDivElement | null>(null);

    // Handle tab change logic
    function handleChange(key: unknown) {
        if (!key && typeof key !== "string") return;

        if (!searchParamName) {
            router.push(`${url}${key}?${params.toString()}`);
            return;
        }

        const newparams = new URLSearchParams();
        if (key) newparams.append(searchParamName, key as string);
        else newparams.delete(searchParamName);

        router[params.get(searchParamName) ? "push" : "replace"](`${url}?${newparams.toString()}`);
    }

    // Scroll logic for the tabs if there are more than 4
    function scroll(direction: "left" | "right") {
        if (!ref.current) return;

        ref.current.scrollBy({
            top: 0,
            left: direction === "right" ? ref.current.clientWidth - position : -position,
            behavior: "smooth"
        });
    }

    // Update scroll position
    function setScrollPosition() {
        if (!ref.current) return;
        const { scrollLeft } = ref.current;
        setPosition(scrollLeft);
    }

    // Initialize scroll position on component mount and listen to scroll events
    useEffect(() => {
        if (!ref.current) return;

        ref.current.addEventListener("scroll", setScrollPosition);
        setScrollPosition();

        return () => {
            ref.current?.removeEventListener("scroll", setScrollPosition);
        };
    }, []);

    return (
        <div className="font-medium mt-2 mb-6 flex items-center relative">
            <Tabs
                onValueChange={handleChange}
                defaultValue={
                    searchParamName
                        ? params.get(searchParamName) || ""
                        : path.replace(url, "").split("/").filter(Boolean).slice(0, 2).join("/") || tabs[0].value
                }
                variant="underline"
            >
                <TabsList variant="underline">
                    {tabs.map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            disabled={disabled}
                            variant="underline"
                        >
                            <div className="flex items-center gap-2">
                                {tab.icon}
                                {tab.name}
                            </div>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>


            {/* Left Scroll Button */}
            {tabs.length > 4 && position > 0 && (
                <button
                    className="absolute xl:hidden top-1 left-0 bg-foreground backdrop-blur-lg rounded-xl p-2"
                    onClick={() => scroll("left")}
                >
                    <HiChevronLeft className="size-5" />
                </button>
            )}

            {/* Right Scroll Button */}
            {tabs.length > 4 && position < (ref.current?.clientWidth || 0) && (
                <button
                    className="absolute xl:hidden top-1 right-0 bg-foreground backdrop-blur-lg rounded-xl p-2"
                    onClick={() => scroll("right")}
                >
                    <HiChevronRight className="size-5" />
                </button>
            )}
        </div>
    );
}

interface FeatureProps {
    items: {
        title: string;
        description: string;
        icon: React.ReactNode;
        color: number;
    }[];
}

export function ListFeature({ items }: FeatureProps) {
    return (
        <div className="grid gap-6 grid-cols-2">
            {items.map((item, i) => {
                const rgb = decimalToRgb(item.color);

                return (
                    <div className="flex items-center gap-3" key={"featurelist-" + item.description.replace(/ +/g, "") + i}>
                        <div
                            className="rounded-full h-12 aspect-square p-[10px] svg-max"
                            style={{
                                backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`,
                                color: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`
                            }}
                        >
                            {item.icon}
                        </div>
                        <span className="text-neutral-300">{item.description}</span>
                    </div>
                );
            })}
        </div>
    );
}