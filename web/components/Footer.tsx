import Link from 'next/link';
import { RocketIcon } from "@radix-ui/react-icons";

export default function Footer() {
  return (
    <footer className="w-full h-px bg-gray-700 mb-6">
      <div className="container p-12 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <RocketIcon className="mr-2 text-slate-600" />
          <span className="text-slate-600 light:text-black">Made by GlitchDetected</span>
        </div>

        <div className="flex flex-col md:flex-row items-center text-slate-600 space-y-2 md:space-y-0 md:space-x-4">
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
        </div>

        <p className="text-slate-600 mt-4 md:mt-0">© 2025 NotificationBot</p>
      </div>
    </footer>
  );
}
