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
  const { gl, canvas, renderer, camera } = useOGL();
  useEffect(() => {
    gl.clearColor(0, 1, 0, 1);
  }, []);

  const renderTarget = useMemo(() => new RenderTarget(gl), []);

  const mousePos = useRef({ old: { x: 0, y: 0 }, new: { x: 0, y: 0 } });
  const mouseAccel = useRef(0);
  const plane = new Plane(gl, {
    width: 1,
    height: 1,
  });

  const triangle = new Triangle(gl);
  const text = MSDFText({ text: "Schedule", plane: plane });
  useEffect(() => {
    const handleResize = () => {
      console.log(camera);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useFrame((state, time) => {
    const bounds = [renderer.width, renderer.height];
    state.camera.left = 0;
    state.camera.right = bounds[0];
    state.camera.top = 0;
    state.camera.bottom = -bounds[1];
    state.camera.updateProjectionMatrix();
  });

  return (
    <Fragment>
      {/* <orbitControls /> */}
      <gridHelper />
      <axesHelper />
      {/* <transform position={[-1, 1, 0]}> */}
      <primitive object={text} />
      <mesh>
        <plane />
        <normalProgram />
      </mesh>
      {/* </transform> */}
    </Fragment>
  );
};
