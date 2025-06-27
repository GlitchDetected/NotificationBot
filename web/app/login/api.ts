import type { User } from "@/common/user";
import type { ApiError } from "@/typings";

interface UserSessionCreate extends User {
  session: string;
}

export async function createSession(code: string): Promise<UserSessionCreate | ApiError | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/callback?code=${encodeURIComponent(code)}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "apikey": process.env.API_SECRET as string
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to create session:", errorText);
      return undefined;
    }

    return await res.json();
  } catch (error) {
    console.error("Error in createSession:", error);
    return undefined;
  }
}
