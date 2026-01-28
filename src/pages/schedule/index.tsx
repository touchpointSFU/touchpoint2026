import { motion } from "motion/react";
import Image from "next/image";

import circleInnovation from "@/assets/Circle-Innovation-RGB-Horiz-Reverse.svg";

import { Fragment, useEffect, useMemo, useRef } from "react";
import {
  Mesh,
  Program,
  RenderTarget,
  Triangle,
  Vec3,
  Text,
  Geometry,
} from "ogl";

import { OGLCanvas } from "@/components/OGLCanvas/OGLCanvas";
import { FinalScene } from "@/components/Shaders/FinalScene";
import { useFrame, useOGL } from "react-ogl";

import basicVert from "@/components/Shaders/basic.vert";
import basicFrag from "@/components/Shaders/metaballs.frag";
import font from "@/assets/ClashDisplay-Semibold.json";
import { MSDFText } from "@/components/Shaders/MSDF/MDSFText";

export default function Home() {
  return (
    <motion.div
      key="home-page"
      className={`flex flex-col leading-none min-h-dvh items-center justify-center bg-zinc-50 font-sans dark:bg-black`}
    >
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
  // useEffect(() => {
  //   gl.clearColor(1, 1, 0, 1);
  // }, [gl]);
  const text = new Text({
    font,
    text: "test",
  });

  // Pass the generated buffers into a geometry
  const geometry = new Geometry(gl, {
    position: { size: 3, data: text.buffers.position },
    uv: { size: 2, data: text.buffers.uv },
    // id provides a per-character index, for effects that may require it
    id: { size: 1, data: text.buffers.id },
    index: { data: text.buffers.index },
  });

  const meshT = new Mesh(gl, {
    geometry,
    program: new Program(gl, {
      vertex: basicVert,
      fragment: basicFrag,
    }),
  });

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
    // renderer.render({ scene: mesh });
  });

  return (
    <Fragment>
      <MSDFText
        text="Hello"
        // textureSrc="/assets/fonts/ClashDisplay-Semibold.png"
      />
    </Fragment>
  );
};
