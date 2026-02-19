import image1 from "@/assets/speakers/test.webp";

import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Texture, TextureLoader } from "ogl";

import { Canvas, useFrame, useLoader, useOGL } from "react-ogl";

import basicVert from "@/components/Shaders/ShaderImage/basic.vert";
import basicFrag from "@/components/Shaders/ShaderImage/basic.frag";
import { motion, MotionValue, useScroll } from "motion/react";

export default function Home() {
  const { scrollYProgress } = useScroll();
  return (
    <div className="min-h-[200dvh]">
      <motion.div
        className="fixed top-8 left-8 size-8 rounded-full bg-red-500 z-100"
        style={{
          scale: scrollYProgress,
        }}
      />
      <div
        className={`fixed inset-0 overflow-x-hidden flex flex-col leading-none items-center justify-center font-sans `}
      >
        <div className="absolute w-1/2 aspect-3/2 border border-amber-50">
          <Canvas
            orthographic
            onCreated={() => {
              console.log("created");
            }}
          >
            <Suspense
              fallback={
                <mesh>
                  <plane />
                  <normalProgram />
                </mesh>
              }
            >
              <Shader scrollYProgress={scrollYProgress} />
            </Suspense>
          </Canvas>
        </div>
        {/* <ul className="relative z-10 w-full p-6">
          {speakers.map((speaker, index) => (
            <li key={index} className="mb-4">
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
        </ul> */}
      </div>
    </div>
  );
}

const Shader = ({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) => {
  const eps = 1e-6; // tiny non-zero bounds
  const { gl, canvas, renderer, scene, camera } = useOGL();
  const [texture, setTexture] = useState<Texture>(new Texture(gl));

  useEffect(() => {
    console.log(gl);
    const tex = new Texture(gl);
    const img = new Image();
    img.src = image1.src;
    img.onload = () => {
      console.log("Image loaded");
      tex.image = img;
      setTexture(tex);
      uniforms.current.uTexture.value = tex;
    };
  }, [gl]);

  const uniforms = useRef({
    uTime: { value: 0.0 },
    uTexture: { value: texture },
    uGridSize: { value: 12 },
    uResolution: { value: [renderer.width, renderer.height] },
    uProgress: { value: 0 },
  });

  useFrame((state, time) => {
    uniforms.current.uTime.value = time / 1000;
    uniforms.current.uProgress.value = scrollYProgress.get();
  });

  useLayoutEffect(() => {
    const handleResize = () => {
      uniforms.current.uResolution.value = [renderer.width, renderer.height];
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderer]);

  return (
    <mesh>
      <triangle />
      <program
        vertex={basicVert}
        fragment={basicFrag}
        uniforms={uniforms.current}
      />
    </mesh>
  );
};
