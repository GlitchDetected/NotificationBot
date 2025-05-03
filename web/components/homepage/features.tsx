import { stylesWithCssVar } from "@/lib/motion";
import { useScroll, useTransform, motion } from "framer-motion";
import Image from 'next/image';
import { useRef } from "react";

export const Features = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.9, 1], [0.8, 0.8, 1]);
  const x = useTransform(scrollYProgress, [0.3, 1], ["50%", "0%"]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.5, 0.6, 0.85, 0.9],
    [1, 1, 0.4, 0.4, 1]
  );

  const text1Opacity = useTransform(
    scrollYProgress,
    [0.3, 0.4, 0.5],
    [0, 1, 0]
  );
  const text1Y = useTransform(
    scrollYProgress,
    [0.3, 0.4, 0.5],
    ["30px", "0px", "-30px"]
  );

  const text2Opacity = useTransform(
    scrollYProgress,
    [0.5, 0.6, 0.7],
    [0, 1, 0]
  );
  const text2Y = useTransform(
    scrollYProgress,
    [0.5, 0.6, 0.7],
    ["30px", "0px", "-30px"]
  );

  const text3Opacity = useTransform(
    scrollYProgress,
    [0.7, 0.8, 0.9],
    [0, 1, 0]
  );
  const text3Y = useTransform(
    scrollYProgress,
    [0.7, 0.8, 0.9],
    ["30px", "0px", "-30px"]
  );

  return (
    <section
      ref={targetRef}
      className="flex h-[500vh] flex-col items-center justify-start"
    >
      <div className="sticky top-[16.7vh] h-[66.8vh] px-16 text-2xl leading-[1] text-white [&_p]:w-[45rem] [&_p]:max-w-[90%]">
        <motion.div style={{ x, scale }} className="relative h-full">
          <motion.figure style={{ opacity }} className="h-full">
            <Image src="/images/homepage/ticket.png" width={500} height={300} className="h-full w-auto" alt={""} />
          </motion.figure>
          <motion.figure style={{ opacity: text2Opacity }}>
            <Image
              src="/images/homepage/rank.png"
              width={500} 
              height={300}
              className="absolute inset-0 h-full w-auto" 
              alt={""}            />
          </motion.figure>
          <motion.figure style={{ opacity: text3Opacity }}>
            <Image
              src="/images/homepage/automod.png"
              width={500} 
              height={300}
              className="absolute inset-0 h-full w-auto" 
              alt={""}            />
          </motion.figure>
        </motion.div>
        <motion.p
          style={stylesWithCssVar({
            opacity: text1Opacity,
            "--y": text1Y,
          })}
          className="translate-y-centered-offset absolute top-1/2 left-0"
        >
          <span className="text-primary">Tickets Tickets Tickets!</span>
          <br />
          Every server needs a ticket system! Thats why we introduce you to /ticket!
        </motion.p>
        <motion.p
          style={stylesWithCssVar({
            opacity: text2Opacity,
            "--y": text2Y,
          })}
          className="translate-y-centered-offset absolute top-1/2 left-0"
        >
          <span className="text-primary">Rankin up your server!</span>
          <br />
          We got 4 special economy commands! /rank, /daily, /balance, /leaderboard
        </motion.p>
        <motion.p
          style={stylesWithCssVar({
            opacity: text3Opacity,
            "--y": text3Y,
          })}
          className="translate-y-centered-offset absolute top-1/2 left-0"
        >
          <span className="text-primary">Automod</span>
          <br />
          Save your time from manually setting up automod! Use /automod to do the hard work efficiently!
        </motion.p>
      </div>
    </section>
  );
};