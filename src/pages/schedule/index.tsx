import { motion } from "motion/react";
import Image from "next/image";

import circleInnovation from "@/assets/Circle-Innovation-RGB-Horiz-Reverse.svg";

import {
  createRef,
  CSSProperties,
  Fragment,
  useEffect,
  useMemo,
  useRef,
} from "react";
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
  const refs = useRef(speakers.map(() => createRef<HTMLLIElement>()));
  useEffect(() => {
    console.log(refs.current.map((ref) => ref.current?.offsetHeight));
  }, [refs]);
  return (
    <motion.div
      key="home-page"
      className={`leading-none font-sans relative`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* <h1 className="text-4xl font-bold mb-8 p-4 fixed top-14">Schedule</h1> */}
      <ul
        className="z-10 w-full flex flex-col"
        style={{
          paddingTop: `calc(100vh)`,
        }}
      >
        {speakers.map((speaker, index) => (
          <li
            key={index}
            className="sticky bg-linear-to-b odd:bg-theme-green even:bg-theme-pink text-background px-margin grid-cols-theme py-4"
            style={
              {
                top: `calc(3.5rem + ${(index + 1) * 4}px)`,
                bottom: `calc(${index * 4}px -${refs.current[index].current?.offsetHeight}px)`,
                // height: `calc(${20}vh)`,
                "--offset": refs.current[index].current?.offsetHeight,
              } as CSSProperties
            }
            ref={refs.current[index]}
          >
            <h2 className="text-2xl font-bold col-span-full md:col-span-4 col-start-1 md:col-start-1">
              {Array.isArray(speaker.names) ? (
                speaker.names.map((name, i) => (
                  <span key={name} className="relative">
                    {name}
                    {i < speaker.names.length - 1 ? (
                      <>
                        , <wbr />
                      </>
                    ) : null}
                    {Array.isArray(speaker.alum) && speaker.alum[i] && (
                      <span className="leading-none text-xs font-bold uppercase absolute top-0 right-0 bg-theme-pink translate-x-full px-1 py-0.5 rounded-full">
                        Alum
                      </span>
                    )}
                  </span>
                ))
              ) : (
                <span className="relative">
                  {speaker.names}{" "}
                  {speaker.alum && (
                    <span className="leading-none text-xs font-bold uppercase absolute top-0 right-0 bg-theme-pink translate-x-full px-1 py-0.5 rounded-full">
                      Alum
                    </span>
                  )}
                </span>
              )}
            </h2>
            <h3 className="col-span-full md:col-span-4 col-start-1 md:col-start-1">
              {speaker.company}
            </h3>
            <p className="col-span-full md:col-span-4 col-start-1 md:col-start-1">
              {speaker.bio}
            </p>
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
