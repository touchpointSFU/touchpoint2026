import { createContext, useEffect, useRef } from "react";
import { Canvas } from "react-ogl";

export const OGLCanvasContext = createContext<{
  canvas: React.RefObject<any> | null;
}>({
  canvas: null,
});

export const OGLCanvas = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<any>(null);
  const eps = 1e-6; // tiny non-zero bounds

  return (
    <OGLCanvasContext value={{ canvas: ref }}>
      <Canvas
        ref={ref}
        // orthographic
        // camera={{
        //   top: 0.5,
        //   left: -0.5,
        //   right: 0.5,
        //   bottom: -0.5,
        // }}
        onCreated={(state) => void state.gl.clearColor(0, 0, 0, 1)}
      >
        {children}
      </Canvas>
    </OGLCanvasContext>
  );
};
