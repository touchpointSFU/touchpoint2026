import { Mesh, Program, Plane } from "ogl";
// import { Mesh, Program, Plane } from "react-ogl";
import { useEffect, useLayoutEffect, useMemo } from "react";

import postVert from "@/components/Shaders/post.vert";
import postFrag from "@/components/Shaders/post.frag";
import { useFrame, useOGL } from "react-ogl";

export function FinalScene({ texture }: { texture: any }) {
  function hexToFloatArray(hex: string) {
    let cleanHex = hex.replace("#", "");

    // Handle shorthand (#fff)
    if (cleanHex.length === 3) {
      cleanHex = cleanHex
        .split("")
        .map((c) => c + c)
        .join("");
    }

    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

    return [r, g, b];
  }

  const testUniforms = useMemo(
    () => ({
      targetColor: "#D3FF7D",
      secondColor: "#FF39E1",
      background: "#000000",
      speed: 1.0,
    }),
    [],
  );

  useFrame(() => {
    program.uniforms.uTargetColor.value = hexToFloatArray(
      testUniforms.targetColor,
    );
    program.uniforms.uSecondColor.value = hexToFloatArray(
      testUniforms.secondColor,
    );
    program.uniforms.uBackground.value = hexToFloatArray(
      testUniforms.background,
    );
  });
  // program.uniforms.uTargetColor.value = hexToFloatArray(
  //   testUniforms.targetColor

  const { gl, size } = useOGL();
  const program = useMemo(
    () =>
      new Program(gl, {
        vertex: postVert,
        fragment: postFrag,
        uniforms: {
          uResolution: { value: [gl.canvas.width, gl.canvas.height] },
          uTexture: { value: texture },
          uTargetColor: { value: hexToFloatArray(testUniforms.targetColor) },
          uSecondColor: { value: hexToFloatArray(testUniforms.secondColor) },
          uBackground: { value: hexToFloatArray(testUniforms.background) },
        },
      }),
    [texture],
  );
  const updateBounds = () => {
    program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
  };
  useLayoutEffect(() => {
    window.addEventListener("resize", updateBounds);
    return () => {
      window.removeEventListener("resize", updateBounds);
    };
  }, []);

  return (
    <mesh program={program}>
      <triangle />
    </mesh>
  );
}
