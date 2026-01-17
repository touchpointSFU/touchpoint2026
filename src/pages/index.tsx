import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0, y: 0 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0, y: -64 }}
      transition={{ duration: 0.5 }}
      key="home-page"
      className={`flex min-h-[150vh] items-center justify-center bg-zinc-50 font-sans dark:bg-black`}
    >
      <h1 className="font-display text-4xl font-semibold">Touchpoint 2026</h1>
    </motion.div>
  );
}
