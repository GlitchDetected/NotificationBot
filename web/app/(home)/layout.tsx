import { Suspense } from "react";

import { Footer } from "@/components/footer";

export const revalidate = 43200;

export default function RootLayout({ children }: { children: React.ReactNode; }) {
    return (
        <div className="w-full mb-20 mt-30">
            {children}

            <Suspense>
                <Footer />
            </Suspense>
        </div>
    );
}