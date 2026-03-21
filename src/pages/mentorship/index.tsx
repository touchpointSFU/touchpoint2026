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

import { Speaker, speakers } from "@/data/speakers";
import {
  Shader,
  ShaderImage,
} from "@/components/Shaders/ShaderImage/ShaderImage";
import { team } from "@/data/team";
import clsx from "clsx";

const SPEAKER_OFFSET = 4;

export default function Page() {
  const [inViews, setInViews] = useState<boolean[]>(speakers.map(() => false));
  const handleInView = (index: number, inView: boolean) => {
    setInViews((prev) => {
      const newInViews = [...prev];
      newInViews[index] = inView;
      return newInViews;
    });
  };

  return (
    <motion.div key="mentorship" className="pb-20 lg:pb-40 xl:pb-60">
      <section className="px-margin relative ">
        <div className="mx-auto max-w-container mb-12 md:mb-40">
          <h1 className="md:pt-8 text-2xl font-bold top-(--nav-height) mb-12 md:mb-20 ">
            On Sunday, March 29 (9am&ndash;1pm), students will meet 1:1 with
            industry professionals for focused, short-form portfolio feedback
            sessions.
          </h1>
          <div>
            <h3 className="text-md font-bold mb-4 md:mb-6">
              Apply by March 18 to be matched with a mentor.
            </h3>
            <a
              className={clsx(
                "bg-theme-pink text-foreground w-fit",
                "transition-transform ease-in-out hover:scale-105 focus:scale-110 active:scale-95 max-md:bg-theme-pink max-md:text-foreground py-3 px-4 block text-md font-bold leading-none",
              )}
              href="https://airtable.com/appmpksCP16ngJAnZ/pag4OZVxVCbcykqSS/form"
              target="_blank"
              rel="noopener noreferrer"
            >
              Start applying
            </a>
          </div>
        </div>
      </section>
      <section className="px-margin relative mb-10 lg:mb-20 xl:mb-30">
        <div className="mx-auto max-w-container grid-cols-theme">
          <h2 className="text-md font-bold col-span-full md:col-span-2 lg:col-span-3 mb-4 text-theme-pink-400">
            What to expect
          </h2>
          <ul className="text-md font-bold col-span-full md:col-span-5 lg:col-span-8 mb-[1em] space-y-[0.75em] -col-end-1 md:-col-end-1 lg:-col-end-1 ">
            <li>A 20-30 minute 1:1 portfolio review</li>
            <li>Direct, constructive feedback from an industry professional</li>
            <li>
              Feedback focused on clarity, presentation, and professional
              readiness
            </li>
          </ul>
        </div>
      </section>
      <section className="px-margin relative mb-10 lg:mb-20 xl:mb-30">
        <div className="mx-auto max-w-container grid-cols-theme">
          <h2 className="text-md font-bold col-span-full md:col-span-2 lg:col-span-3 mb-4 text-theme-pink-400">
            Requirements
          </h2>

          <p className="text-md font-bold col-span-full md:col-span-5 lg:col-span-8 mb-[0.5em] -col-end-1 md:-col-end-1 lg:-col-end-1">
            Due to the event format, students must be available for the full
            duration of the event.
          </p>
          <p className="col-span-full md:col-span-5 lg:col-span-8 mb-[1em] -col-end-1 md:-col-end-1 lg:-col-end-1">
            Students may be matched with more than one mentor during the event.
            Sessions will be approximately 20–30 minutes, and you may have
            multiple reviews scheduled between 9:00 AM&ndash;1:00 PM.
          </p>
          <p className="col-span-full md:col-span-5 lg:col-span-8 mb-[1em] -col-end-1 md:-col-end-1 lg:-col-end-1">
            Mentors will be matched based on expertise, availability, and your
            portfolio focus.
          </p>
        </div>
      </section>
      <section className="px-margin relative">
        <div className="mx-auto max-w-container grid-cols-theme">
          <h2 className="text-md font-bold col-span-full md:col-span-2 lg:col-span-3 mb-4 text-theme-pink-400">
            Additional info
          </h2>
          <div className="col-span-full md:col-span-5 lg:col-span-8 -col-end-1 md:-col-end-1 lg:-col-end-1">
            <p className="mb-[1em]">
              These sessions are short-term reviews and are not guaranteed to
              continue beyond the event. Ongoing mentorship is at the discretion
              of the mentor.
            </p>
            <p className="mb-[1em]">
              All confirmations and schedule details will be sent via email.
            </p>
            <p className="mb-[1em]">
              Please monitor your inbox, including spam and trash folders, in
              the days leading up to the event.
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
