import type React from "react";

import type { User } from "@/common/userStore";
import type { ApiError } from "@/typings";

enum State {
    Idle = 0,
    Loading = 1,
    Failure = 2
}

export async function authorize({ setState }: { setState: React.Dispatch<React.SetStateAction<State>>; }) {
    setState(State.Idle);

    const res = (await fetch(`${process.env.NEXT_PUBLIC_API}/sessions`, {
    // must return exact structure as User in order to authorize
        credentials: "include"
    })
        .then((res) => res.json())
        .catch(() => null)) as User | ApiError | null;

    if (res && "status" in res && res.status.toString().startsWith("4")) {
    // if it is a 4xx error, redirect to login
        window.location.href = "/login";
        return null;
    }

    if (!res) {
        setState(State.Failure);
        return null;
    }

    setState(State.Idle);
    return res;
}