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

export default function Page({ theme }: { theme: string }) {
  return (
    <div className="min-h-[calc(100dvh)] flex flex-col overflow-hidden relative">
      <div className="absolute inset-0">
        <Canvas>
          <Shader />
        </Canvas>
      </div>
      <main className="flex-1 flex flex-col justify-center px-margin">
        {/* headers and body copy */}
        <article className="w-full max-w-container z-1 mx-auto">
          <hgroup>
            <h1 className="uppercase text-2xl font-extrabold text-theme-pink-800 mb-[0.1em] blur-[1px]">
              Touchpoint 2026
            </h1>
            <h2 className="text-xl font-semibold text-theme-pink-800 mt-4 blur-[1px]">
              Design, rooted in community
            </h2>
          </hgroup>

          <div className="flex justify-between flex-wrap gap-x-8 gap-y-4 md:flex-row lg:items-center mt-12">
            <a
              href="https://maps.app.goo.gl/zwD9oCXdacCJeGEz6"
              className="group text-md text-theme-green block underline  w-fit"
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
              href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Touchpoint+2026&dates=20260321T153000Z/20260321T233000Z&location=Surrey+Engineering+Building%2C+Surrey%2C+BC%2C+Canada&details=Touchpoint+2026%0A%0ARSVP%3A+https%3A%2F%2Fwww.eventbrite.ca%2Fe%2Ftouchpoint-2026-tickets-1981807024158%3Faff%3Doddtdtcreator"
              className="group text-md text-theme-green block underline w-fit"
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
  useEffect(() => {
    console.log(canvas);
    console.log(renderer);
  }, []);

  const renderTarget = useMemo(() => new RenderTarget(gl), []);

  const mousePos = useRef({ old: { x: 0, y: 0 }, new: { x: 0, y: 0 } });
  const mouseDir = useRef({ x: 1, y: 1 });

  const mesh = new Mesh(gl, {
    geometry: new Triangle(gl),
    program: new Program(gl, {
      vertex: basicVert,
      fragment: basicFrag,
      uniforms: {
        uTime: { value: 0.0 },
        uMouse: { value: [0.0, 0.0] },
        uDisplacement: { value: [0.0, 0.0] },
        uResolution: { value: [renderer.width, renderer.height] },
        uMetablobs: { value: [] },
        uSpeed: { value: matchMedia("(pointer:fine)").matches ? 1 : 1 },
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

        const deltaX = (mN.x - mO.x) * renderer.width;
        const deltaY = (mN.y - mO.y) * renderer.height;

        // console.log("Deltas:", deltaX, deltaY);
        if (deltaX !== 0 && deltaY !== 0) {
          if (Math.abs(mouseDir.current.x) < 1.5)
            mouseDir.current.x +=
              Math.abs(deltaX) > 0.5 ? Math.sign(deltaX) : 0;
          if (Math.abs(mouseDir.current.y) < 1.5)
            mouseDir.current.y +=
              Math.abs(deltaY) > 0.5 ? Math.sign(deltaY) : 0;
        }

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

  useEffect(() => {
    const handleResize = () => {
      const rect = gl.canvas.getBoundingClientRect();
      console.log(renderer.dpr);
      console.log("Rect", rect.width, rect.height);
      console.log("Canvas", gl.canvas.width, gl.canvas.height);
      console.log("Renderer", renderer.width, renderer.height);
      mesh.program.uniforms.uResolution.value = [
        renderer.width,
        renderer.height,
      ];
    };
    window.addEventListener("resize", () => {
      handleResize();
    });
    return () => {
      window.removeEventListener("resize", () => {
        handleResize();
      });
    };
  }, []);

  useFrame((root, time) => {
    mesh.program.uniforms.uTime.value = time * 0.001;
    const deltaX =
      (mousePos.current.new.x - mousePos.current.old.x) * renderer.width;
    const deltaY =
      (mousePos.current.new.y - mousePos.current.old.y) * renderer.height;
    if (Math.abs(mouseDir.current.x) > 0.3) mouseDir.current.x *= 0.95;
    if (Math.abs(mouseDir.current.y) > 0.3) mouseDir.current.y *= 0.95;
    mesh.program.uniforms.uDisplacement.value[0] += 0.01 * mouseDir.current.x;
    mesh.program.uniforms.uDisplacement.value[1] += 0.01 * mouseDir.current.y;
    // console.log(deltaX, deltaY);
    // if (deltaX !== 0 || deltaY !== 0) {
    //   mesh.program.uniforms.uMouse.value = [deltaX, deltaY];
    // }
    if (deltaX !== 0 || deltaY !== 0) {
      mesh.program.uniforms.uMouse.value = [
        mousePos.current.new.x,
        mousePos.current.new.y,
      ];
    }
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

  return <FinalScene texture={renderTarget.texture} />;
};

export async function getStaticProps() {
  return {
    props: {
      // theme: "",
    },
  };
}
