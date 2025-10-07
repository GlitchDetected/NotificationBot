import "./marquee.css";

import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/cn";

export type MarqueeProps = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
    direction?: "left" | "up";
    pauseOnHover?: boolean;
    reverse?: boolean;
    fade?: boolean;
    innerClassName?: string;
    numberOfCopies?: number;
    height?: string | number;
};

export function Marquee({
    children,
    direction = "left",
    pauseOnHover = false,
    reverse = false,
    fade = false,
    className,
    innerClassName,
    numberOfCopies = 9,
    height = "15rem",
    ...rest
}: MarqueeProps) {
    return (
        <div
            className={cn(
                "group relative overflow-hidden w-full flex",
                direction === "left" ? "flex-row" : "flex-col",
                className
            )}
            style={{
                height,
                maskImage: fade
                    ? `linear-gradient(${
                        direction === "left" ? "to right" : "to bottom"
                    }, transparent 0%, rgba(0, 0, 0, 1.0) 10%, rgba(0, 0, 0, 1.0) 90%, transparent 100%)`
                    : undefined,
                WebkitMaskImage: fade
                    ? `linear-gradient(${
                        direction === "left" ? "to right" : "to bottom"
                    }, transparent 0%, rgba(0, 0, 0, 1.0) 10%, rgba(0, 0, 0, 1.0) 90%, transparent 100%)`
                    : undefined
            }}
            {...rest}
        >
            {Array(numberOfCopies)
                .fill(0)
                .map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "flex justify-around gap-[1rem] [--gap:1rem] shrink-0",
                            direction === "left"
                                ? "animate-marquee-left flex-row"
                                : "animate-marquee-up flex-col",
                            pauseOnHover && "group-hover:[animation-play-state:paused]",
                            reverse && "direction-reverse",
                            innerClassName
                        )}
                    >
                        {children}
                    </div>
                ))}
        </div>
    );
}