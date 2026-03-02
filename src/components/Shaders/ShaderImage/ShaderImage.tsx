import { MotionValue, animate } from "motion/react";
import { Color, Texture } from "ogl";
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Canvas, useFrame, useOGL } from "react-ogl";
import basicVert from "@/components/Shaders/ShaderImage/basic.vert";
import basicFrag from "@/components/Shaders/ShaderImage/basic.frag";
import { motion, useInView, useMotionValue, useScroll } from "motion/react";
import clsx from "clsx";

export const ShaderImage = ({
  uTexture,
  uBackground,
  uTargetColor,
  uSecondColor,
  className,
}: {
  uTexture: string;
  uBackground: [number, number, number] | Color;
  uTargetColor: [number, number, number];
  uSecondColor: [number, number, number];
  className?: string;
}) => {
  const progress = useMotionValue(0);
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

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

  const isInView = useInView(ref, {
    margin: "0px 0px 0px 0px",
    amount: 0.8,
  });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  useEffect(() => {
    if (isInView) {
      animate(progress, 1, { duration: 1, ease: "easeInOut" });
    } else {
      animate(progress, 0, { duration: 1, ease: "easeInOut" });
    }
  }, [isInView]);

  return (
    <div
      ref={ref}
      className={clsx("aspect-square flex items-top justify-center", className)}
    >
      <Canvas
        orthographic
        onCreated={() => {
          console.log("created");
        }}
      >
        <Suspense fallback={null}>
          <Shader
            uTexture={uTexture}
            uBackground={uBackground}
            uProgress={progress}
            uTargetColor={uTargetColor}
            uSecondColor={uSecondColor}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export const Shader = ({
  uTexture,
  uBackground,
  uProgress,
  uTargetColor,
  uSecondColor,
}: {
  uTexture: string;
  uBackground: [number, number, number] | Color;
  uProgress?: MotionValue<number>;
  uTargetColor: [number, number, number];
  uSecondColor: [number, number, number];
}) => {
  const eps = 1e-6; // tiny non-zero bounds
  const { gl, canvas, renderer, scene, camera } = useOGL();
  const [texture, setTexture] = useState<Texture>(
    new Texture(gl, {
      generateMipmaps: false,
    }),
  );

  useEffect(() => {
    console.log(gl);
    const tex = new Texture(gl, {
      generateMipmaps: false,
    });
    const img = new Image();
    img.src = uTexture;
    img.onload = () => {
      console.log("Image loaded");
      tex.image = img;
      setTexture(tex);
      uniforms.current.uTexture.value = tex;
    };
  }, [gl, uTexture]);

  const uniforms = useRef({
    uTime: { value: 0.0 },
    uTexture: { value: texture },
    uBackground: { value: uBackground },
    uTargetColor: { value: uTargetColor },
    uSecondColor: { value: uSecondColor },
    uDPR: { value: renderer.dpr },
    uGridSize: { value: 36 },
    uResolution: { value: [renderer.width, renderer.height] },
    uProgress: { value: 0 },
  });

  useFrame((state, time) => {
    uniforms.current.uTime.value = time / 1000;
    uniforms.current.uProgress.value = uProgress?.get() || 0;
    uniforms.current.uBackground.value = uBackground;
  });

  useLayoutEffect(() => {
    // alert(renderer.dpr);
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
