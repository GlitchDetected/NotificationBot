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
          <h3>Filters</h3>
          <p>Keep any chat clean with our many automated filtering options.</p>
        </div>

        <div className="card">
          <h3>Fake Permissions</h3>
          <p>Remove all dangerous Discord permissions that can be used for malicious reasons through API.</p>
        </div>

        <div className="card">
          <h3>Anti-nuke</h3>
          <p>
            Easily prevent your server from malicious attacks and griefing, with a customizable threshold set by you.
          </p>
        </div>

        <div className="card">
          <h3>Anti-raid</h3>
          <p>
            Protect against targeted bot raids on your server, with our mass join, avatar and account age anti-raid
            filters.
          </p>
        </div>

      <div className="button-link">
        <AnimatedBorderTrail
          className=" rounded-full bg-red-950 hover:bg-red-300"
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
}