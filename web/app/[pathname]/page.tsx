import { notFound, redirect } from "next/navigation";

interface Props {
    params: Promise<{ pathname: string; }>;
}

const fetchOptions = { next: { revalidate: 60 * 60 } };
const utm = "?utm_source=notificationbot.up.railway.app&utm_medium=redirect";

export default async function Home({ params }: Props) {
    const { pathname } = await params;

    switch (pathname) {
        case "support": return redirect("https://discord.com/invite/DNyyA2HFM9");
        case "vote": return redirect("https://top.gg/bot/1237878380838523001#vote" + utm);
        case "add": return redirect("https://discord.com/oauth2/authorize?client_id=1237878380838523001");
        case "get": return redirect("/login?invite=true");
        case "logout": return redirect("/login?logout=true");
        case "invite":
        case "youtube": {
            const res = await fetch("https://www.youtube.com/@RandomDevelopment0", fetchOptions)
                .then((res) => res.json())
                .catch(() => null) as { videoUrl: string; } | null;

            return redirect(res?.videoUrl || "https://www.youtube.com/@RandomDevelopment0");
        }
    }

    notFound();
}