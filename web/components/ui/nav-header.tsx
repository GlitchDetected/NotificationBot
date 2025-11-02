"use client";

import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { useEffect, useMemo, useState } from "react";
import {
    HiAdjustments,
    HiBeaker,
    HiChevronDown,
    HiEyeOff,
    HiIdentification,
    HiLogout
} from "react-icons/hi";

import { type User, userStore } from "@/common/userStore";
import { webStore } from "@/common/webStore";
import { authorize } from "@/utils/authorizeuser";
import { cn } from "@/utils/cn";

import { Button } from "./button";
import { LoginButton } from "./login-button";
import ReduceMotion from "./reducemotion";
import { Skeleton } from "./skeleton";
import { Switch } from "./switch";

enum State {
    Idle = 0,
    Loading = 1,
    Failure = 2
}

type ButtonItem =
  | { type: "split"; }
  | { name: string; icon: React.ReactNode; url: string; }
  | { name: string; icon: React.ReactNode; value: boolean; onChange: () => void; };

const split = { type: "split" } as const;

function UserButton({
    user,
    menu,
    setMenu
}: {
    user?: User;
    menu: boolean;
    setMenu: (v: boolean) => void;
}) {
    return (
        <button
            className={cn(
                "ml-auto truncate flex hover:bg-foreground py-2 px-4 rounded-lg duration-200 items-center",
                menu && "bg-foreground"
            )}
            onClick={() => setMenu(!menu)}
        >
            {!user?.id ? (
                <>
                    <Skeleton className="rounded-full mr-2 size-[30px]" />
                    <Skeleton className="rounded-xl w-20 h-4" />
                </>
            ) : (
                <>
                    <ReduceMotion
                        alt="your avatar"
                        className="rounded-full mr-2 size-[30px] shrink-0"
                        url={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatarHash}`}
                        size={96}
                    />
                    <p className="mr-1 relative bottom-px truncate block">
                        {user.displayName || user.username}
                    </p>
                    <HiChevronDown />
                </>
            )}
        </button>
    );
}

function UserDropdown({
    user,
    menu,
    buttons,
    setMenu
}: {
    user?: User;
    menu: boolean;
    buttons: ButtonItem[];
    setMenu: (v: boolean) => void;
}) {
    return (
        <motion.div
            initial="closed"
            animate={menu ? "open" : "closed"}
            exit="closed"
            variants={{
                closed: { y: -16, opacity: 0, scale: 0.9 },
                open: { y: 0, opacity: 1, scale: 1 }
            }}
            className="ml-auto w-full sm:w-72 bg-black/40 rounded-xl backdrop-blur-xs backdrop-brightness-75 shadow-xl
                 flex flex-col py-2 sm:py-1 p-2 sm:p-0"
        >
            <div className="flex items-center space-x-3 px-4 py-2">
                <ReduceMotion
                    alt="your avatar"
                    className="rounded-full size-14 sm:size-10 shrink-0"
                    url={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatarHash}`}
                    size={128}
                />
                <div className="w-full">
                    <div className="text-neutral-200 max-w-40 truncate font-medium text-xl sm:text-base">
                        {user?.displayName || user?.username}
                    </div>
                    <div className="text-neutral-400 max-w-40 truncate -mt-1 text-medium sm:text-sm">
                        @{user?.username}
                    </div>
                </div>
                <button
                    className="ml-auto text-red-500 m-4"
                    onClick={() => {
                        window.location.href = "/login?logout=true";
                        userStore.setState({ __fetched: true });
                        setMenu(false);
                    }}
                >
                    <HiLogout className="size-5" />
                </button>
            </div>

            {buttons.map((button, i) => {
                if ("type" in button && button.type === "split") {
                    return (
                        <hr
                            key={"headerButton-" + i}
                            className="my-1 mx-2 dark:border-foreground border-foreground-100"
                        />
                    );
                }

                if ("url" in button)
                    return (
                        <Button
                            key={"headerButton-" + button.name + button.url}
                            asChild
                            className="w-full font-medium justify-start text-xl my-1 sm:my-0 sm:text-medium bg-transparent hover:bg-foreground rounded-sm"
                            onClick={() => setMenu(false)}
                            variant="secondary"
                        >
                            <Link href={button.url!}>
                                {button.icon}
                                {button.name}
                            </Link>
                        </Button>
                    );

                if ("onChange" in button)
                    return (
                        <div
                            key={"headerButton-" + button.name}
                            className="flex items-center px-4 pt-2 pb-3"
                        >
                            {button.icon}
                            <span className="ml-[9px] text-xl my-1 sm:text-medium sm:my-0">
                                {button.name}
                            </span>
                            <Switch
                                key={"headerButton-" + button.name}
                                className="ml-auto"
                                checked={button.value}
                                onCheckedChange={button.onChange}
                                aria-label={button.name}
                                color="secondary"
                            />
                        </div>
                    );
            })}
        </motion.div>
    );
}

export function LoginHeader() {
    const cookies = useCookies();
    const devTools = cookies.get("devTools") === "true";
    const reduceMotions = cookies.get("reduceMotions") === "true";
    const [menu, setMenu] = useState(false);
    const [state, setState] = useState<State>(State.Loading);
    const user = userStore((s) => s);
    const router = useRouter();

    useEffect(() => {
        authorize({ setState }).then((_user) => {
            userStore.setState({ ...(_user || {}), __fetched: true });
        });

        webStore.setState({ width: window?.innerWidth });
    }, []);

    const buttons = useMemo(
        () => [
            split,
            {
                name: "Profile",
                icon: <HiIdentification />,
                url: "/profile"
            },
            {
                name: "Reduce Motion",
                icon: <HiEyeOff />,
                value: reduceMotions,
                onChange: () => {
                    if (!reduceMotions) cookies.set("reduceMotions", "true", { expires: 365 });
                    else cookies.remove("reduceMotions");
                    router.refresh();
                }
            },
            ...(user?.HELLO_AND_WELCOME_TO_THE_DEV_TOOLS__PLEASE_GO_AWAY
                ? [
                    split,
                    {
                        name: "Debug",
                        icon: <HiAdjustments />,
                        url: "/debug"
                    },
                    {
                        name: "Developer Tools",
                        icon: <HiBeaker />,
                        value: devTools,
                        onChange: () => {
                            if (!devTools) cookies.set("devTools", "true", { expires: 365 });
                            else cookies.remove("devTools");
                            router.refresh();
                        }
                    }
                ]
                : [])
        ],
        [user, reduceMotions, devTools, router, cookies]
    );

    return (
        <>
            {state === State.Failure ? (
                <LoginButton state={state} className="ml-auto" />
            ) : (
                <UserButton user={user} menu={menu} setMenu={setMenu} />
            )}

            <MotionConfig
                transition={
                    reduceMotions
                        ? { duration: 0 }
                        : { type: "spring", bounce: 0.4, duration: menu ? 0.7 : 0.4 }
                }
            >
                <AnimatePresence initial={false}>
                    {user?.id && menu && (
                        <div className="absolute top-[72px] right-3.5 z-50 w-[calc(100%-1.6rem)]">
                            <UserDropdown
                                user={user}
                                menu={menu}
                                setMenu={setMenu}
                                buttons={buttons}
                            />
                        </div>
                    )}
                </AnimatePresence>
            </MotionConfig>
        </>
    );
}