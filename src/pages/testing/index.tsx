import { motion } from "motion/react";
import Image from "next/image";
import ScrollingNames from "@/components/ScrollingNames";

import circleInnovation from "@/assets/Circle-Innovation-RGB-Horiz-Reverse.svg";

import { Fragment, useEffect, useMemo, useRef } from "react";

export default function Testing() {
  return (
    <div className="flex h-screen items-center ">
      <div className="">
        <p>With speakers from</p>
        <ScrollingNames direction={"right"} />
        <ScrollingNames direction={"left"} />
      </div>
    </div>
  );
}
