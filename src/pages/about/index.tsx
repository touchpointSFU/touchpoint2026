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
    <motion.div
      key="home-page"
      className={`font-sans relative bg-theme-green text-background`}
    >
      <section className="px-margin relative ">
        <div className="mx-auto max-w-container">
          <h1 className="md:pt-8 sticky bottom-0 text-xl font-bold  mb-8 top-(--nav-height)">
            Design is far more than just pixels and interfaces. It is a way of
            seeing and shaping the world.
          </h1>
        </div>
      </section>
      <section className="px-margin relative">
        <div className="mx-auto max-w-container grid-cols-theme">
          <h2 className="text-lg font-bold ">About Touchpoint</h2>
          <p className="col-span-full md:col-span-5 xl:col-span-8 mb-6 -col-end-1 md:-col-end-1 xl:-col-end-1">
            Touchpoint is an annual design conference for the creative
            community, that serves as a space for design practitioners,
            students, and like-minded individuals where bright ideas form the
            most inspired minds.
          </p>
          <p className="col-span-full md:col-span-5 xl:col-span-8 mb-6 -col-end-1 md:-col-end-1 xl:-col-end-1">
            Designed to spark dialogue and collaboration, it offers a platform
            to discuss opportunities, confront challenges, and form connections.
          </p>
        </div>
      </section>
      <section className="px-margin relative">
        <div className="mx-auto max-w-container grid-cols-theme">
          <h2 className="text-lg font-bold ">The theme</h2>
          <p className="col-span-full md:col-span-5 xl:col-span-8 mb-6 -col-end-1 md:-col-end-1 xl:-col-end-1">
            Everything we make continues designing and affecting people,
            cultures, and environments — often in ways we don’t fully
            acknowledge. When we see design in this more expansive,
            transformative way, we inevitably arrive at community: design does
            not happen in isolation.
          </p>
          <p className="col-span-full md:col-span-5 xl:col-span-8 mb-6 -col-end-1 md:-col-end-1 xl:-col-end-1">
            In these turbulent times, we keep our sense of drive, hope, and
            responsibility alive by showing up for one another. This ongoing
            creative process involves growing, negotiating, and reimagining the
            roles of design in making critical change.
          </p>
          <p className="col-span-full md:col-span-5 xl:col-span-8 mb-6 -col-end-1 md:-col-end-1 xl:-col-end-1">
            Touchpoint 2026 creates space for these alternative modes of design
            to be seen, shared, and valued.
          </p>
          <p className="col-span-full md:col-span-5 xl:col-span-8 mb-6 -col-end-1 md:-col-end-1 xl:-col-end-1">
            It is a reminder that design is bigger than screens or a single
            individual, and it aims to spark inspiration in the next generation
            of designers while highlighting the importance of collective action.
          </p>
          <p className="col-span-full md:col-span-5 xl:col-span-8 mb-6 -col-end-1 md:-col-end-1 xl:-col-end-1">
            This is design rooted in community: real, grounded, collaborative,
            human. No fluff, just the work, together.
          </p>
        </div>
      </section>
      <section className="px-margin relative">
        <div className="mx-auto max-w-container grid-cols-theme">
          <h2 className="text-lg font-bold ">The team</h2>
          <ul className="col-span-full md:col-span-5 xl:col-span-8 grid grid-cols-subgrid">
            <li>
              <h3>Nam</h3>
              <p>Rol</p>
            </li>
          </ul>
        </div>
      </section>
    </motion.div>
  );
}

const SpeakerCard = ({
  speaker,
  index,
  handleInView,
  lastInView,
}: {
  speaker: Speaker;
  index: number;
  lastInView: number;
  handleInView: (index: number, inView: boolean) => void;
}) => {
  const ref = useRef(null);
  const [height, setHeight] = useState<number | null>(null);

  const inView = useInView(ref, { margin: "0px 0px -50% 0px" });

  const style = useRef<CSSStyleDeclaration | null>(null);

  useEffect(() => {
    if (ref.current) style.current = getComputedStyle(ref.current as Element);
  }, [ref]);

  useEffect(() => {
    handleInView(index, inView);
  }, [inView]);

  useEffect(() => {
    const value =
      style.current &&
      style.current.getPropertyValue(
        `--theme-pink-${9 - Math.abs(index - lastInView)}00`,
      );

    if (value) {
      animate(pinkVal, value, { duration: 0.5, ease: "easeOut" });
    }
  }, [lastInView]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      setHeight(
        ref.current
          ? (ref.current as HTMLElement).getBoundingClientRect().height
          : 0,
      );
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const pinkVal = useMotionValue(
    `var(--theme-pink-${9 - Math.abs(index - lastInView)}00)`,
  );

  const rgbaToHex = (rgba: string): string => {
    const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (!match) return rgba; // Return original if not rgba format

    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);

    return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
  };

  // Track the current hex value
  const [currentHex, setCurrentHex] = useState<string>("");

  useMotionValueEvent(pinkVal, "change", (latest) => {
    const hex = rgbaToHex(latest);
    setCurrentHex(hex);
  });

  return (
    <motion.li
      key={index}
      className="sticky bg-linear-to-b group text-background px-margin pb-4"
      style={
        {
          top: `calc(-${height}px)`,
          bottom: `calc(${(speakers.length - index) * SPEAKER_OFFSET}rem - ${height}px)`,
          background: pinkVal,
        } as any
      }
      // animate={{
      //   background: pinkVal,
      // }}
      ref={ref}
    >
      <div className="max-w-container mx-auto grid-cols-theme items-start">
        <div className="col-span-full md:col-span-5 xl:col-span-8 mb-6 -col-end-1 md:-col-end-1 xl:-col-end-1">
          <motion.hgroup
            className="z-1 py-4 sticky flex flex-col top-(--nav-height)"
            initial={false}
            style={{
              background: pinkVal,
            }}
          >
            <h2 className="text-lg font-bold mb-2">
              {Array.isArray(speaker.names) ? (
                speaker.names.map((name, i) => (
                  <span key={name} className="relative">
                    {name}
                    {i < speaker.names.length - 1 ? (
                      <>
                        , <wbr />
                      </>
                    ) : null}
                  </span>
                ))
              ) : (
                <span className="relative">{speaker.names}</span>
              )}
            </h2>
            <h3 className="font-bold">{speaker.company}</h3>
          </motion.hgroup>
          <p className="mt-auto mb-8 max-w-[50ch]">{speaker.bio}</p>
        </div>

        {speaker.img && (
          <ShaderImage
            uTexture={speaker.img.src}
            uBackground={
              new Color(
                typeof currentHex === "string" ? currentHex : pinkVal.get(),
              )
            }
            uTargetColor={[0.83, 1, 0.49]}
            uSecondColor={[1, 0.22, 0.88]}
            className="relative bg-background/1 col-span-full md:col-span-3 xl:col-span-4 col-start-1 md:mt-4 xl:mt-4 md:-col-end-1 xl:-col-end-1 max-md:mb-6"
          />
        )}
      </div>
    </motion.li>
  );
};

export async function getStaticProps() {
  return {
    props: {
      theme: "green",
    },
  };
}
