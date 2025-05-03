import { RocketIcon, EraserIcon, CodeIcon, SpeakerLoudIcon, GearIcon, GlobeIcon, HeartIcon } from "@radix-ui/react-icons";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const content = [
  {
    icon: RocketIcon,
    title: "1",
    text: "1",
  },
  {
    icon: EraserIcon,
    title: "2",
    text: "2",
  },
  {
    icon: CodeIcon,
    title: "3",
    text: "3",
  },
  {
    icon: SpeakerLoudIcon,
    title: "4",
    text: "4",
  },
  {
    icon: GearIcon,
    title: "5",
    text: "5",
  },
  {
    icon: GlobeIcon,
    title: "6",
    text: "6",
  },
];

export const Reviews = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);
  const y = useTransform(scrollYProgress, [0.8, 1], ["0vh", "50vh"]);

  return (
    <motion.section
      ref={targetRef}
      style={{ opacity, y }}
      className="mx-auto w-full max-w-[120rem] py-24 sm:py-32 lg:py-40 mt-20"
    >
<div className="flex justify-center items-center mb-16 bg-zinc-700 rounded-full h-16 w-16">
  <HeartIcon className="h-8 w-8"/>
</div>


      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-100">
          Highly trusted by server owners & staff
        </h2>
        <p className="mt-4 text-sm sm:text-md text-gray-400">
          We appreciate every feedback you give us!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
        {content.map(({ icon: Icon, title, text }, index) => (
          <div
            key={title}
            className={`text-center p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-zinc-700 to-zinc-900 rounded-4xl shadow-lg relative ${
              index === 0 || index === 5 ? "h-[400px]" : "h-[300px]" // Boxes 1 and 6 (index 0 and 5) are taller
            }`}
            style={{
              background: "radial-gradient(circle, #333333, #151515)",
            }}
          >
            <span className="absolute top-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#151515]">
              <Icon className="h-8 w-8 text-white" />
            </span>
            <h3 className="mt-16 mb-2 text-lg sm:text-xl text-white">{title}</h3>
            <p className="text-sm sm:text-md text-white">{text}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
};
