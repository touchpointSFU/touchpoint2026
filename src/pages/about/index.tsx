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

const SPEAKER_OFFSET = 4;

export default function Home() {
  const [inViews, setInViews] = useState<boolean[]>(speakers.map(() => false));
  const handleInView = (index: number, inView: boolean) => {
    setInViews((prev) => {
      const newInViews = [...prev];
      newInViews[index] = inView;
      return newInViews;
    });
  };

  return (
    <motion.div key="about" className="pb-20 lg:pb-40 xl:pb-60">
      <section className="px-margin relative ">
        <div className="mx-auto max-w-container">
          <h1 className="md:pt-8 sticky bottom-0 text-2xl font-bold  mb-8 top-(--nav-height)">
            Design is far more than just pixels and interfaces. It is a way of
            seeing and shaping the world.
          </h1>
        </div>
      </section>
      <section className="px-margin relative mb-10 lg:mb-20 xl:mb-30">
        <div className="mx-auto max-w-container grid-cols-theme">
          <h2 className="text-md font-bold col-span-full md:col-span-2 lg:col-span-3 mb-4">
            About Touchpoint
          </h2>
          <p className="text-md font-semibold col-span-full md:col-span-5 lg:col-span-8 mb-[1em] -col-end-1 md:-col-end-1 lg:-col-end-1">
            Touchpoint is an annual design conference for the creative
            community, that serves as a space for design practitioners,
            students, and like-minded individuals where bright ideas form the
            most inspired minds.
          </p>
          <p className="col-span-full md:col-span-5 lg:col-span-8 mb-[1em] -col-end-1 md:-col-end-1 lg:-col-end-1">
            Designed to spark dialogue and collaboration, it offers a platform
            to discuss opportunities, confront challenges, and form connections.
          </p>
        </div>
      </section>
      <section className="px-margin relative mb-10 lg:mb-20 xl:mb-30">
        <div className="mx-auto max-w-container grid-cols-theme">
          <h2 className="text-md font-bold col-span-full md:col-span-2 lg:col-span-3 mb-4">
            The theme
          </h2>
          <p className="col-span-full md:col-span-5 lg:col-span-8 mb-[1em] -col-end-1 md:-col-end-1 lg:-col-end-1">
            Everything we make continues designing and affecting people,
            cultures, and environments — often in ways we don’t fully
            acknowledge. When we see design in this more expansive,
            transformative way, we inevitably arrive at community: design does
            not happen in isolation.
          </p>
          <p className="col-span-full md:col-span-5 lg:col-span-8 mb-[1em] -col-end-1 md:-col-end-1 lg:-col-end-1">
            In these turbulent times, we keep our sense of drive, hope, and
            responsibility alive by showing up for one another. This ongoing
            creative process involves growing, negotiating, and reimagining the
            roles of design in making critical change.
          </p>
          <p className="text-md font-semibold col-span-full md:col-span-5 lg:col-span-8 mt-[0.5em] mb-[0.5em] -col-end-1 md:-col-end-1 lg:-col-end-1">
            Touchpoint 2026 creates space for these alternative modes of design
            to be seen, shared, and valued.
          </p>
          <p className="col-span-full md:col-span-5 lg:col-span-8 mb-[1em] -col-end-1 md:-col-end-1 lg:-col-end-1">
            It is a reminder that design is bigger than screens or a single
            individual, and it aims to spark inspiration in the next generation
            of designers while highlighting the importance of collective action.
          </p>
          <p className="col-span-full md:col-span-5 lg:col-span-8 mb-[1em] -col-end-1 md:-col-end-1 lg:-col-end-1">
            This is design rooted in community: real, grounded, collaborative,
            human. No fluff, just the work, together.
          </p>
        </div>
      </section>
      <section className="px-margin relative">
        <div className="mx-auto max-w-container grid-cols-theme">
          <h2 className="text-md font-bold col-span-full md:col-span-2 lg:col-span-3 mb-4">
            The team
          </h2>
          <ul className="col-span-full md:col-span-5 lg:col-span-8 -col-end-1 md:-col-end-1 lg:-col-end-1 grid grid-cols-subgrid">
            {team.map((member) => (
              <li
                className="sm:grid grid-cols-subgrid col-span-full mb-[0.5em]"
                key={member.name}
              >
                <h3 className="col-span-2 font-semibold">{member.name}</h3>
                <p className="col-span-2">{member.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </motion.div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      theme: "green",
    },
  };
}
