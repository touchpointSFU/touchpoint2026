import {
  Color,
  OGLRenderingContext,
  Program,
  Texture,
  Text,
  Geometry,
  Mesh,
  Vec3,
  Plane,
} from "ogl";
import { render, useFrame, useOGL } from "react-ogl";
import font from "@/assets/ClashDisplay-Semibold.json";
import fragment100 from "./frag100.frag";
import fragment300 from "./frag300.frag";
import vertex100 from "./vert100.vert";
import vertex300 from "./vert300.vert";
import { use, useEffect, useMemo, useRef, useState } from "react";

export const ShaderImage = ({ src }: { src: string }) => {
  const { gl, renderer, scene, camera } = useOGL();

  const texture = new Texture(gl, { generateMipmaps: false });
  const textureImage = new Image();

  textureImage.src = src;
  textureImage.onload = (_) => (texture.image = textureImage);
  console.log(texture);

  let fragmentShader = fragment100;
  let vertexShader = vertex100;

  if (renderer.isWebgl2) {
    fragmentShader = fragment300;
    vertexShader = vertex300;
  }

  const program = new Program(gl, {
    cullFace: null,
    depthTest: false,
    depthWrite: false,
    transparent: true,
    fragment: fragmentShader,
    vertex: vertexShader,
    uniforms: {
      uColor: { value: new Color("#FF0000") },
      tMap: { value: texture },
      uWidth: { value: renderer.width },
      uHeight: { value: renderer.height },
      uDPR: { value: renderer.dpr },
      modelViewMatrix: { value: camera.viewMatrix },
      projectionMatrix: { value: camera.projectionMatrix },
    },
  });

  const sizeRef = useRef({ width: renderer.width, height: renderer.height });

  const mesh = new Mesh(gl, {
    geometry: new Plane(gl, {
      width: 10,
      height: 10,

      //   width: renderer.width,
      //   height: renderer.height,
    }),
    program,
  });

  //   mesh.position.x = 0;
  //   mesh.position.y = 0;

  useEffect(() => {
    const handleResize = () => {};
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useFrame(() => {
    program.uniforms.uWidth.value = renderer.width;
    program.uniforms.uHeight.value = renderer.height;
    program.uniforms.uDPR.value = renderer.dpr;
    // console.log(camera.viewMatrix);
    // console.log(camera.projectionMatrix);
    program.uniforms.modelViewMatrix.value = camera.viewMatrix;
    program.uniforms.projectionMatrix.value = camera.projectionMatrix;
  });

  return mesh;
};
