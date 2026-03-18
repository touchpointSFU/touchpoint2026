import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
} from "motion/react";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { Color } from "ogl";

import { schedule, ScheduleItem } from "@/data/schedule";

import clsx from "clsx";

export default function Page() {
  return (
      <motion.div key="schedule" className="pb-20 lg:pb-40">
        <section className="px-margin relative ">
          <div className="mx-auto max-w-container">
            <h1 className="md:pt-8 text-2xl font-bold top-(--nav-height) mb-12">
              Schedule
            </h1>
          </div>
        </section>
        <section className="px-margin relative mb-10 lg:mb-20 xl:mb-30">
          <ul className={"mx-auto max-w-container mb-12 md:mb-40"}>
            {
                schedule.map((item, index) => (
                    <li key={index} className={"text-lg font-semibold mb-[1em]"}>
                      <time className={"text-md block mb-[0.25em]"}>{item.start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</time>
                      <hgroup>{item.item}
                        {item.subitem && <p className={"font-normal"}>{item.subitem}</p>}
                      </hgroup>
                    </li>
                ))
            }
          </ul>
        </section>
      </motion.div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      theme: "pink",
    },
  };
}
