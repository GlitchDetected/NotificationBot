import type { User } from "@/common/userStore";
import type { ApiError } from "@/typings";
import { getCanonicalUrl } from "@/lib/urls";

interface UserSessionCreate extends User {
    sessiontoken: string;
}

export async function createSession(code: string): Promise<UserSessionCreate | ApiError | undefined> {

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        apikey: process.env.API_SECRET as string
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/sessions`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            code, // authorization code
            redirectUri: getCanonicalUrl("login")
        })
    });

    return res.json();
}