import ScrollingNames from "@/components/ScrollingNames";
import { FinalScene } from "@/components/Shaders/FinalScene";
import Footer from "@/components/footer";
import { Mesh, Program, RenderTarget, Triangle, Vec3 } from "ogl";
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useOGL } from "react-ogl";
import { Fragment } from "react/jsx-runtime";
import basicVert from "@/components/Shaders/basic.vert";
import basicFrag from "@/components/Shaders/metaballs.frag";

export default function Testing() {
  return (
    <div className="min-h-[calc(100dvh-var(--nav-height))] flex flex-col overflow-hidden relative">
      <div className="absolute inset-0">
        <Canvas>
          <Shader />
        </Canvas>
      </div>
      <main className="flex flex-col flex-1 z-1">
        {/* headers and body copy */}
        <div className="flex flex-col justify-between lg:flex-row items-center md:items-start px-4 md:px-12 md:pt-12 pt-8">
          <hgroup className="text-center md:text-left">
            <h1 className="font-display mb-2 leading-[100%] font-light text-lg text-theme-pink">
              Touchpoint 2026
            </h1>
            <h2 className="font-display mb-6 text-md leading-[1.2em]  text-theme-green">
              Alternative Modes of Design,<br></br> Rooted in Community
            </h2>
          </hgroup>
        </div>

        {/* Middle section (takes remaining space, centers marquee) */}
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center md:items-start w-full">
            <p className="text-description text-theme-green font-medium mb-2 md:pl-12">
              With speakers from
            </p>
            <ScrollingNames direction="right" />
            <ScrollingNames direction="left" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
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
