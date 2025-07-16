import { Lilita_One, Noto_Sans_JP, Outfit } from "next/font/google";

export const lilita = Lilita_One({ subsets: ["latin"], weight: "400" });
export const outfit = Outfit({ subsets: ["latin", "latin-ext"], variable: "--font-outfit" });
export const notosansJP = Noto_Sans_JP({ subsets: ["cyrillic", "vietnamese"], variable: "--font-noto-sans-jp" });