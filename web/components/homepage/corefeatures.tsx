import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedBorderTrail from "@/components/animata/container/animated-border-trail";

export function Corefeatures() {
        const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

  return (
<motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="card">
          <h3>Third Party Posts</h3>
          <p>With NotificationBot, you can easily setup notifications for your favorite sites like YouTube, TikTok, and Twitch just from the dashboard. No slash commands needed!</p>
        </div>

        <div className="card">
          <h3>RSS Notifications</h3>
          <p>RSS and content feed updates</p>
        </div>

        <div className="card">
          <h3>Custom announcements</h3>
          <p>
            Easily send custom announcements from your server's NotificationBot dashboard
          </p>
        </div>

        <div className="card">
          <h3>/Purge</h3>
          <p>
            Delete old announcements with /purge or use the dashboard instead!
          </p>
        </div>

      <div className="col-span-full flex justify-center button-link">
        <AnimatedBorderTrail
          className=" rounded-full bg-gray-500 hover:bg-red-300"
          contentClassName="rounded-full bg-zinc-800"
          trailColor="white"
        >
          <Link href="/commands">
            <button className="button">More Commands</button>
          </Link>
        </AnimatedBorderTrail>
      </div>

      </motion.div>
        );
};