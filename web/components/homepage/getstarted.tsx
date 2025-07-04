import Link from "next/link";

export function Getstarted() {
    return (
        <div className="bg-[#151515] text-white py-32 px-40 lg:p-24 rounded-2xl shadow-xl text-center max-w-5xl mx-auto mt-25">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">Enhance your community’s experience by 1000%.</h2>
            <p className="text-lg lg:text-xl opacity-90 mb-6">Get NotificationBot in your server today.</p>

            <div className="button-link">
                <Link href="/profile" target="_blank">
                    <button className="button">Get Started</button>
                </Link>
            </div>
        </div>
    );
}