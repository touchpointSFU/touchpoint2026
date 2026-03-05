import tilesheet from "@/assets/tiles.png";
import { Mesh, Program, Plane, Texture, ImageRepresentation } from "ogl";
// import { Mesh, Program, Plane } from "react-ogl";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";

import postVert from "@/components/Shaders/post.vert";
import postFrag from "@/components/Shaders/post.frag";
import { useFrame, useOGL } from "react-ogl";
import { u } from "motion/react-client";

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
      targetColor: "#FF39E1",
      secondColor: "#0a0a0a",
      background: "#0a0a0a",
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

  const { gl, size } = useOGL();

  const [tiles, setTiles] = useState<Texture>(
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
    img.src = tilesheet.src;
    img.onload = () => {
      console.log("Image loaded", img);
      tex.image = img;
      setTiles(tex);
      program.uniforms.uTilesheet.value = tex;
    };
  }, [gl, tilesheet]);
  // program.uniforms.uTargetColor.value = hexToFloatArray(
  //   testUniforms.targetColor

  const program = useMemo(
    () =>
      new Program(gl, {
        vertex: postVert,
        fragment: postFrag,
        uniforms: {
          uResolution: { value: [gl.canvas.width, gl.canvas.height] },
          uTexture: { value: texture },
          uTilesheet: {
            value: tiles,
          },
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
