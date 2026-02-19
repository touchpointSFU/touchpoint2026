import { motion } from "motion/react";
import NextImage from "next/image";
import image1 from "@/assets/speakers/test.png";

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
  Texture,
  TextureLoader,
} from "ogl";

import { OGLCanvas } from "@/components/OGLCanvas/OGLCanvas";
import { FinalImage } from "@/components/Shaders/ShaderImage/FinalImage";
import { Canvas, useFrame, useLoader, useOGL } from "react-ogl";

import basicVert from "@/components/Shaders/ShaderImage/basic.vert";
import basicFrag from "@/components/Shaders/ShaderImage/basic.frag";
import font from "@/assets/ClashDisplay-Semibold.json";
import { MSDFText } from "@/components/Shaders/MSDF/MDSFText";
import { speakers } from "@/data/speakers";
import { ShaderImage } from "@/components/Shaders/ShaderImage/ShaderImage";

export default function Home() {
  return (
    <motion.div
      key="home-page"
      className={`fixed inset-0 overflow-x-hidden flex flex-col leading-none min-h-dvh items-center justify-center font-sans `}
      // initial={{ opacity: 0 }}
      // animate={{ opacity: 1 }}
      // exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute w-1/2 aspect-3/2 border border-amber-50"
        // initial={{ opacity: 0 }}
        // animate={{
        //   opacity: 1,
        //   transition: { delay: 0.2, duration: 0.7, ease: "easeOut" },
        // }}
        // exit={{ opacity: 0 }}
      >
        <Canvas
          orthographic
          camera={{ top: 1, left: -1, right: 1, bottom: -1 }}
        >
          <Shader />
        </Canvas>
      </motion.div>
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
    </motion.div>
  );
}

const Shader = () => {
  const eps = 1e-6; // tiny non-zero bounds
  const { gl, canvas, renderer, camera } = useOGL();

  const texture = new Texture(gl, { generateMipmaps: false });
  const textureImage = new Image();

  const texture2 = useLoader(TextureLoader, image1.src);
  useEffect(() => {
    console.log(gl);
  }, []);
  useEffect(() => {
    console.log(texture2);
  }, [texture2]);

  textureImage.src = image1.src;
  textureImage.onload = (_) => {
    texture.image = textureImage;
    // console.log("Texture loaded");
  };

  const renderTarget = useMemo(() => new RenderTarget(gl), []);
  const renderTarget2 = useMemo(() => new RenderTarget(gl), []);

  const mesh = useRef(
    new Mesh(gl, {
      geometry: new Triangle(gl),
      program: new Program(gl, {
        vertex: basicVert,
        fragment: basicFrag,
        uniforms: {
          uTime: { value: 0.0 },
          uMouse: { value: [0.0, 0.0] },
          uResolution: { value: [gl.canvas.width, gl.canvas.height] },
          uSpeed: { value: matchMedia("(pointer:fine)").matches ? 0.5 : 4 },
          uMobile: {
            value: matchMedia("(pointer:fine)").matches ? false : true,
          },
          uTexture: { value: texture2 },
          uDotSize: { value: 12 },
        },
      }),
    }),
  );

  const mousePos = useRef({ old: { x: 0, y: 0 }, new: { x: 0, y: 0 } });
  const mouseAccel = useRef(0);

  return (
    <Fragment>
      {/* <orbitControls /> */}
      <gridHelper />
      <axesHelper />

      <mesh>
        <triangle args={[0.5, 1]} />

        <program
          vertex={basicVert}
          fragment={basicFrag}
          uniforms={mesh.current.program.uniforms}
        />
      </mesh>

      {/* <FinalImage texture={renderTarget.texture} /> */}
    </Fragment>
  );
};
