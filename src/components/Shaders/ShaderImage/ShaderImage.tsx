import { MotionValue, animate } from "motion/react";
import { Texture } from "ogl";
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Canvas, useFrame, useOGL } from "react-ogl";
import basicVert from "@/components/Shaders/ShaderImage/basic.vert";
import basicFrag from "@/components/Shaders/ShaderImage/basic.frag";
import { motion, useInView, useMotionValue, useScroll } from "motion/react";
import clsx from "clsx";

export const ShaderImage = ({
  uTexture,
  uBackground,
  className,
}: {
  uTexture: string;
  uBackground: [number, number, number];
  className?: string;
}) => {
  const progress = useMotionValue(0);
  const ref = useRef(null);
  const isInView = useInView(ref, {
    margin: "0px 0px -50% 0px",
  });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  useEffect(() => {
    if (isInView) {
      animate(progress, 1, { duration: 0.3, ease: "linear" });
    } else {
      animate(progress, 0, { duration: 0.3, ease: "linear" });
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
}: {
  uTexture: string;
  uBackground: [number, number, number];
  uProgress?: MotionValue<number>;
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
    uDPR: { value: renderer.dpr },
    uGridSize: { value: 24 },
    uResolution: { value: [renderer.width, renderer.height] },
    uProgress: { value: 0 },
  });

  useFrame((state, time) => {
    uniforms.current.uTime.value = time / 1000;
    uniforms.current.uProgress.value = uProgress?.get() || 0;
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
