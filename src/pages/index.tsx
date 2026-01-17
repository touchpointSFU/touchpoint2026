import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import circleInnovation from "/public/circle-innovation-logo-white.png";

export default function Home() {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0, y: 0 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0, y: -64 }}
      transition={{ duration: 0.5 }}
      key="home-page"
      className={`flex flex-col leading-none min-h-dvh items-center justify-center bg-zinc-50 font-sans dark:bg-black`}
    >
      <h1 className="font-display text-[#FF39E1] mb-4 md:mb-8 min-[1920px]:mb-10.5 text-display font-semibold">
        Touchpoint 2026
      </h1>
      <p className="text-description font-Haas text-touchpoint-green mb-2 md:mb-4 min-[1920px]:mb-6 ">
        SFU Surrey Engineering Building
      </p>
      <time
        className="text-touchpoint-green text-description font-bold"
        dateTime="2026-03-21"
      >
        03.21.2026
      </time>

      <div className="absolute font-Haas bottom-16 gap-5 flex flex-col md:flex-row items-center">
        <span className="text-[1rem] text-muted-foreground">In partnership with</span>

        <Image className="max-w-30 md:max-w-40" src={circleInnovation} alt="Circle Innovation" />
      </div>

    </motion.div>
  );
}
