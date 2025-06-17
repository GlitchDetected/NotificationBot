import type { User } from "@/common/user";
import type { ApiError } from "@/typings";

interface UserSessionCreate extends User {
  session: string;
}

export async function createSession(code: string): Promise<UserSessionCreate | ApiError | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SITE}/auth/callback?code=${encodeURIComponent(code)}`, {
      method: "GET", // Fix: Express expects GET, not POST
      credentials: "include", // Ensure cookies are included if your backend sets them
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to create session:", errorText);
      return undefined; // or return an error object
    }

    return await res.json();
  } catch (error) {
    console.error("Error in createSession:", error);
    return undefined;
  }
}
