import ScrollingNames from "@/components/ScrollingNames";
import { FinalScene } from "@/components/Shaders/FinalScene";
import Footer from "@/components/footer";
import { Mesh, Program, RenderTarget, Triangle, Vec3 } from "ogl";
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useOGL } from "react-ogl";
import { Fragment } from "react/jsx-runtime";
import basicVert from "@/components/Shaders/basic.vert";
import basicFrag from "@/components/Shaders/metaballs.frag";
import Arrow from "@/assets/arrow.svg";

export default function Testing({ theme }: { theme: string }) {
  return (
    <div className="min-h-[calc(100dvh-var(--nav-height))] flex flex-col gap-8 overflow-hidden relative">
      <div className="absolute inset-0">
        {/* <Canvas>
          <Shader />
        </Canvas> */}
      </div>
      <main className="flex-1 flex flex-col justify-center px-margin">
        {/* headers and body copy */}
        <article className="w-full max-w-container z-1 mx-auto">
          <div className="flex flex-col justify-between lg:flex-row items-center md:items-start">
            <hgroup className="text-center md:text-left">
              <h1 className="uppercase text-xl font-extrabold text-theme-pink-800 mb-[0.1em]">
                Touchpoint 2026
              </h1>
              <h2 className="text-lg font-semibold text-theme-pink-800">
                Design, rooted in community
              </h2>
            </hgroup>
          </div>
          <div className="flex justify-between flex-row lg:items-center mt-12">
            <a
              href="https://maps.app.goo.gl/zwD9oCXdacCJeGEz6"
              className="group text-2xl text-theme-green underline"
            >
              <h3>SFU Engineering Building</h3>
              <p className="inline-flex underline">
                10285 University Dr{" "}
                <span className="inline-block ml-0.5 my-auto size-[1em] fill-current overflow-hidden relative">
                  <Arrow className="absolute group-hover:scale-125 group-hover:translate-x-full group-hover:-translate-y-full transition-transform duration-300" />
                  <Arrow className="absolute -translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 group-hover:scale-125 transition-transform duration-300" />
                </span>
              </p>
            </a>
            <a
              href="https://maps.app.goo.gl/zwD9oCXdacCJeGEz6"
              className="group text-2xl text-theme-green block underline"
            >
              <time dateTime="2026-03-21">
                Saturday
                <br />
                <span className="inline-flex underline">
                  03.21.2026
                  <span className="inline-block ml-0.5 my-auto size-[1em] fill-current overflow-hidden relative">
                    <Arrow className="absolute group-hover:scale-125 group-hover:translate-x-full group-hover:-translate-y-full group-focus:scale-125 group-focus:translate-x-full group-focus:-translate-y-full transition-transform duration-300" />
                    <Arrow className="absolute -translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 group-hover:scale-125 group-focus:translate-x-0 group-focus:translate-y-0 group-focus:scale-125 transition-transform duration-300" />
                  </span>
                </span>
              </time>
            </a>
          </div>
        </article>
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
        uSpeed: { value: matchMedia("(pointer:fine)").matches ? 4 : 4 },
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
    // if (mouseAccel.current > 0.5) mouseAccel.current *= 0.9; // Apply damping to decelerate more naturally
    // if (matchMedia("(pointer:fine)").matches)
    //   mesh.program.uniforms.uSpeed.value = mouseAccel.current;
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

export async function getStaticProps() {
  return {
    props: {
      // theme: "",
    },
  };
}
