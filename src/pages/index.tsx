import { motion } from "motion/react";
import Image from "next/image";

import circleInnovation from "@/assets/Circle-Innovation-RGB-Horiz-Reverse.svg";

import { Fragment, useEffect, useMemo, useRef } from "react";
import { Mesh, Program, RenderTarget, Triangle, Vec3 } from "ogl";

import { OGLCanvas } from "@/components/OGLCanvas/OGLCanvas";
import { FinalScene } from "@/components/Shaders/FinalScene";
import { useFrame, useOGL } from "react-ogl";

import basicVert from "@/components/Shaders/basic.vert";
import basicFrag from "@/components/Shaders/metaballs.frag";
import Link from "next/link";

export default function Home() {
  return (
    <motion.div
      key="home-page"
      className={`fixed inset-0 overflow-x-hidden flex flex-col leading-none min-h-dvh items-center justify-center font-sans `}
    >
      <motion.hgroup
        className="relative z-10 text-center"
        initial={{ scale: 0.95, opacity: 0, y: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          y: 0,
          transition: { delay: 0.1, duration: 0.7 },
        }}
        exit={{
          scale: 0.95,
          opacity: 0,
          y: -64,
          transition: { duration: 0.5 },
        }}
        key="home_text"
      >
        <h1 className="font-display text-theme-pink mb-4 md:mb-8 min-[1920px]:mb-10.5 text-display font-semibold">
          Touchpoint 2026
        </h1>
        <p className="text-description font-medium text-theme-green mb-2 md:mb-4 min-[1920px]:mb-6 ">
          SFU Surrey Engineering Building
        </p>
        <time
          className="text-theme-green text-description font-medium"
          dateTime="2026-03-21"
        >
          03.21.2026
        </time>
        <a
          className="bg-background border-2 border-theme-pink text-theme-pink focus:bg-theme-pink focus:text-background hover:bg-theme-pink hover:text-background font-display font-semibold text-2xl xl:text-4xl px-4 py-2 mt-8 flex mx-auto w-fit my-4"
          href="https://www.eventbrite.ca/e/1981807024158?aff=oddtdtcreator"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get tickets
        </a>
      </motion.hgroup>

      <a
        className="absolute z-10 bottom-16 gap-3 flex flex-col md:flex-row items-center"
        href="https://circleinnovation.ca/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="text-base">In partnership with</span>

        <Image
          className="max-w-30 md:max-w-40"
          src={circleInnovation}
          alt="Logo: Circle Innovation"
        />
      </a>

      <div className="absolute inset-0">
        <OGLCanvas>
          <Shader />
        </OGLCanvas>
      </div>
    </motion.div>
  );
}

const Shader = () => {
  const { gl, canvas, renderer } = useOGL();

  const renderTarget = useMemo(() => new RenderTarget(gl), []);

  const mousePos = useRef({ old: { x: 0, y: 0 }, new: { x: 0, y: 0 } });
  const mouseAccel = useRef(0);

  const mesh = new Mesh(gl, {
    geometry: new Triangle(gl),
    program: new Program(gl, {
      vertex: basicVert,
      fragment: basicFrag,
      uniforms: {
        uTime: { value: 0.0 },
        uMouse: { value: [0.0, 0.0] },
        uResolution: { value: [gl.canvas.width, gl.canvas.height] },
        uMetablobs: { value: [] },
        uSpeed: { value: matchMedia("(pointer:fine)").matches ? 0.5 : 4 },
        uMobile: { value: matchMedia("(pointer:fine)").matches ? false : true },
      },
    }),
  });

  const metablobs = useRef(
    Array.from(
      { length: 50 },
      () =>
        new Vec3(
          2 * Math.random() - 1.0,
          2 * Math.random() - 1.0,
          Math.random() * 0.3,
          // 1.2
        ),
    ),
  );

  useEffect(() => {
    if (matchMedia("(pointer:fine)").matches) {
      const handleMouseMove = (e: MouseEvent) => {
        const mO = mousePos.current.old;
        const mN = mousePos.current.new;

        if (mouseAccel.current < 50)
          mouseAccel.current +=
            10 * Math.sqrt(Math.pow(mN.x - mO.x, 2) + Math.pow(mN.y - mO.y, 2));
        const rect = gl.canvas.getBoundingClientRect();
        const x = e.clientX / rect.width - 0.5;
        // const y = 1.0 - e.clientY / gl.canvas.height;
        const y = 0.5 - e.clientY / rect.height;
        mousePos.current.old = { ...mousePos.current.new };
        mousePos.current.new = { x, y };
        metablobs.current.map((mb) => {
          mb.x += Math.random() >= 0.5 ? 0.05 : -0.05;
          mb.y += Math.random() >= 0.5 ? 0.05 : -0.05;
        });
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, []);

  useFrame((root, time) => {
    mesh.program.uniforms.uTime.value = time * 0.001;
    mesh.program.uniforms.uMouse.value = [
      mousePos.current.old.x,
      mousePos.current.old.y,
    ];
    if (mouseAccel.current > 0.5) mouseAccel.current *= 0.9; // Apply damping to decelerate more naturally
    if (matchMedia("(pointer:fine)").matches)
      mesh.program.uniforms.uSpeed.value = mouseAccel.current;
    // mesh.program.uniforms.uMouse.value = [
    //   mousePositionN.current[0],
    //   mousePositionN.current[1],
    // ];
    mesh.program.uniforms.uResolution.value = [
      root.renderer.width,
      root.renderer.height,
    ];
    mesh.program.uniforms.uMetablobs.value = metablobs.current;
    renderer.render({ scene: mesh, target: renderTarget });
  });

  return (
    <Fragment>
      <FinalScene texture={renderTarget.texture} />
    </Fragment>
  );
};
