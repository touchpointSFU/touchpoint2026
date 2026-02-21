import { motion } from "motion/react";

import { CSSProperties, useEffect, useRef, useState } from "react";

import { Speaker, speakers } from "@/data/speakers";
import {
  Shader,
  ShaderImage,
} from "@/components/Shaders/ShaderImage/ShaderImage";

export default function Home() {
  return (
    <motion.div
      key="home-page"
      className={`font-sans relative`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <section
        className="px-margin relative"
        style={{
          height: `calc(100vh - var(--nav-height) - ${2 * speakers.length}rem)`,
        }}
      >
        <h1 className="sticky bottom-0 text-xl font-bold mb-8 top-(--nav-height)">
          Speakers
        </h1>
      </section>
      <ul className="z-10 w-full flex flex-col">
        {speakers.map((speaker, index) => (
          <SpeakerCard key={index} speaker={speaker} index={index} />
        ))}
      </ul>
    </motion.div>
  );
}

const SpeakerCard = ({
  speaker,
  index,
}: {
  speaker: Speaker;
  index: number;
}) => {
  const ref = useRef(null);
  const [height, setHeight] = useState<number | null>(null);

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

  return (
    <li
      key={index}
      className="sticky bg-linear-to-b odd:bg-theme-green even:bg-theme-pink group text-background px-margin grid-cols-theme pb-4"
      style={
        {
          top: `calc(-${height}px)`,
          bottom: `calc(${(speakers.length - index) * 2}rem - ${height}px)`,
        } as CSSProperties
      }
      ref={ref}
    >
      <hgroup className="z-1 group-odd:bg-theme-green group-even:bg-theme-pink py-4 sticky top-(--nav-height) col-span-full md:col-span-3 xl:col-span-4 col-start-1 md:col-start-1">
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
        <h3>{speaker.company}</h3>
      </hgroup>
      {/*  - `#ff39e1` (pink): `[1, 0.22, 0.88]`
  - `#d3ff7d` (green): `[0.83, 1, 0.49]` */}
      {speaker.img && (
        <ShaderImage
          uTexture={speaker.img.src}
          uBackground={index % 2 === 1 ? [1, 0.22, 0.88] : [0.83, 1, 0.49]}
          uTargetColor={[1, 0.22, 0.88]}
          uSecondColor={[0.83, 1, 0.49]}
          className="relative bg-background/10 col-span-full md:col-span-3 xl:col-span-4 col-start-1 md:col-start-1 xl:col-start-1 max-md:mb-6"
        />
      )}

      <p className="col-span-full md:col-span-5 xl:col-span-8 self-end">
        {speaker.bio}
      </p>
    </li>
  );
};
