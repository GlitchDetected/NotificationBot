import "./globals.css";

import { ActiveSectionContextProvider } from "@/lib/active-section-context";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { Lexend, Noto_Sans_JP, Outfit } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { getBaseUrl } from "@/lib/urls";
import Notice, { NoticeType } from "@/components/notice";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const outfit = Outfit({ subsets: ["latin", "latin-ext"], variable: "--font-outfit" });
const notosansJP = Noto_Sans_JP({ subsets: ["cyrillic", "vietnamese"], variable: "--font-noto-sans-jp" });

const lexend = Lexend({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#1c1c1c",
  initialScale: 0.85
};

export const generateMetadata = (): Metadata => {
  const title = "NotificationBot: Engage with your server";
  const description =
    "Engage with leaderboards, levels, and more! Have fun with commands like /rank, /leaderboard and protect your server with /lockdown!";

  return {
    metadataBase: new URL(getBaseUrl()),

    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      title: "NotificationBot",
      startupImage: "/images/notificationbot256.webp",
      statusBarStyle: "black-translucent"
    },

    title: {
      default: title,
      template: "%s"
    },

    description,
    keywords: ["discord", "bot"],

    alternates: {
      canonical: getBaseUrl()
    },

    openGraph: {
      title: {
        default: title,
        template: "%s on NotificationBot Dashboard"
      },
      description,
      type: "website",
      url: getBaseUrl(),
      images: `${getBaseUrl()}/images/notificationbot256.webp`
    },

    other: {
      google: "notranslate"
    },

    creator: "GlitchDetected",
    publisher: "GlitchDetected",

    robots: "index, follow"
  };
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      suppressHydrationWarning
      data-theme="dark"
      lang="en"
      className="dark flex justify-center max-w-screen overflow-x-hidden"
    >
      <link rel="icon" href="/icons/favicon.ico" sizes="any" />
      <body
        className={cn("w-full max-w-7xl overflow-x-hidden xl:!overflow-visible", outfit.variable, notosansJP.variable)}
        style={{ overflow: "visible" }}
      >
        <div className="absolute top-0 right-0 w-screen h-screen -z-50" />
        {/* <Noise /> */}
        <NoScript />
        <ActiveSectionContextProvider>
          <Navbar />
          {children}
        </ActiveSectionContextProvider>
      </body>
    </html>
  );
}

// function Noise() {
//   return (
//       <svg
//           className="absolute top-0 left-0 w-screen h-full -z-40 blur-[1px] saturate-0"
//           viewBox='0 0 142 158'
//           xmlns='http://www.w3.org/2000/svg'
//       >
//           <filter id='noiseFilter'>
//               <feTurbulence
//                   type="fractalNoise"
//                   baseFrequency="9"
//                   numOctaves="1"
//                   stitchTiles="stitch"
//                   result="turbulence"

//               />
//               <feComponentTransfer>
//                   <feFuncR type="table" tableValues="-1 0.2" />
//                   <feFuncG type="table" tableValues="-1 0.2" />
//                   <feFuncB type="table" tableValues="-1 0.2" />
//               </feComponentTransfer>
//           </filter>

//           <rect
//               className="w-screen h-screen"
//               filter='url(#noiseFilter)'
//           />
//       </svg>
//   );
// }

function NoScript() {
  return (
    <noscript className="p-4 pb-0 flex">
      <Notice
        className="mb-0"
        message="This site needs JavaScript to work - Please either enable JavaScript or update to a supported Browser."
        type={NoticeType.Info}
      />
    </noscript>
  );
}
