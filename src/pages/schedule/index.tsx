import { motion } from "motion/react";
import Image from "next/image";

import circleInnovation from "@/assets/Circle-Innovation-RGB-Horiz-Reverse.svg";

import { Fragment, useEffect, useMemo, useRef } from "react";
import {
  Mesh,
  Program,
  RenderTarget,
  Triangle,
  Plane,
  Vec3,
  Text,
  Geometry,
} from "ogl";

import { OGLCanvas } from "@/components/OGLCanvas/OGLCanvas";
import { FinalMSDF } from "@/components/Shaders/MSDF/FinalMSDF";
import { useFrame, useOGL } from "react-ogl";

import basicVert from "@/components/Shaders/basic.vert";
import vert100 from "@/components/Shaders/MSDF/vert100.vert";
import basicFrag from "@/components/Shaders/MSDF/metaballs.frag";
import font from "@/assets/ClashDisplay-Semibold.json";
import { MSDFText } from "@/components/Shaders/MSDF/MDSFText";
import { speakers } from "@/data/speakers";

export default function Home() {
  return (
    <motion.div
      key="home-page"
      className={`leading-none font-sans relative`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* <h2 className="text-4xl font-bold mb-8 p-4 sticky top-14">Schedule</h2> */}
      <ul
        className="z-10 w-full flex flex-col gap-10"
        style={{
          paddingTop: `calc(100vh - 20vh - ${4 * speakers.length}px)`,
        }}
      >
        {speakers.map((speaker, index) => (
          <li
            key={index}
            className="sticky block bg-linear-to-b odd:bg-theme-green/100 even:bg-theme-pink/100 text-background p-4"
            style={{
              top: `0`,
              bottom: `calc(${(speakers.length - index) * 4}px)`,
              height: `calc(${20}vh)`,
            }}
          >
            <h2 className="text-2xl font-bold">
              {Array.isArray(speaker.names)
                ? speaker.names.join(", ")
                : speaker.names}
            </h2>
            {Array.isArray(speaker.names)
              ? speaker.names.join(", ")
              : speaker.names}{" "}
            - {speaker.company} -{" "}
            {Array.isArray(speaker.alum)
              ? speaker.alum
                  .map((alum) => (alum ? "Alum" : "Current"))
                  .join(", ")
              : speaker.alum
                ? "Alum"
                : "Current"}
          </li>
        ))}
      </ul>
      <div className="h-dvh" />
    </motion.div>
  );
}

const Shader = () => {
  const eps = 1e-6; // tiny non-zero bounds
  const { gl, canvas, renderer, camera } = useOGL();
  useEffect(() => {
    // gl.clearColor(0, 1, 0, 1);
  }, []);

  const sizeRef = useRef({ width: renderer.width, height: renderer.height });

  const text = MSDFText({
    text: "Schedule",
    test: sizeRef.current.height,
  });

  const renderTarget = useMemo(() => new RenderTarget(gl), []);
  const renderTarget2 = useMemo(() => new RenderTarget(gl), []);

  const mesh = new Mesh(gl, {
    geometry: new Triangle(gl),
    program: new Program(gl, {
      vertex: basicVert,
      fragment: basicFrag,
      uniforms: {
        uTime: { value: 0.0 },
        uMouse: { value: [0.0, 0.0] },
        uResolution: { value: [gl.canvas.width, gl.canvas.height] },
        uSpeed: { value: matchMedia("(pointer:fine)").matches ? 0.5 : 4 },
        uMobile: { value: matchMedia("(pointer:fine)").matches ? false : true },
        uTexture: { value: renderTarget.texture },
        uDotSize: { value: 12 },
      },
    }),
  });

  const mousePos = useRef({ old: { x: 0, y: 0 }, new: { x: 0, y: 0 } });
  const mouseAccel = useRef(0);
  const plane = new Plane(gl, {
    width: 1,
    height: 1,
  });

  const triangle = new Triangle(gl);

  useEffect(() => {
    const handleResize = () => {
      console.log(camera);
      console.log(renderer);
      console.log(canvas);
      mesh.program.uniforms.uDotSize.value = renderer.width > 568 ? 24 : 12;
      renderer.render({
        scene: text,
        target: renderTarget,
      });
      renderer.render({
        scene: mesh,
        target: renderTarget2,
      });
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    };
  }, []);

  useFrame((state, time) => {
    // state.gl.clearColor(0, 0, 0, 1);
    const bounds = [renderer.width, renderer.height];
    // state.camera.left = 0;
    state.camera.right = renderer.width;
    // state.camera.top = 0;
    state.camera.bottom = -renderer.height;
    state.camera.updateProjectionMatrix();
    mesh.program.uniforms.uDotSize.value = renderer.width > 568 ? 24 : 12;
    mesh.program.uniforms.uTime.value = time * 0.001;
    renderer.render({
      scene: text,
      target: renderTarget,
    });
    renderer.render({
      scene: mesh,
      target: renderTarget2,
    });
  });

  return (
    <mesh>
      <box />
      <normalProgram />
    </mesh>
  );
};
