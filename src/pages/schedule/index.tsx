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

export default function Home() {
  return (
    <motion.div
      key="home-page"
      className={`fixed inset-0 overflow-x-hidden flex flex-col leading-none min-h-dvh items-center justify-center font-sans `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { delay: 0.2, duration: 0.7, ease: "easeOut" },
        }}
        exit={{ opacity: 0 }}
      >
        <OGLCanvas>
          <Shader />
        </OGLCanvas>
      </motion.div>
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
    test: sizeRef.current.width,
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
    <Fragment>
      {/* <orbitControls /> */}
      <gridHelper />
      <axesHelper />

      <FinalMSDF texture={renderTarget2.texture} />
    </Fragment>
  );
};
