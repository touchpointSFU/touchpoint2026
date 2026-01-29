import {
  Color,
  OGLRenderingContext,
  Program,
  Texture,
  Text,
  Geometry,
  Mesh,
  Vec3,
} from "ogl";
import { render, useFrame, useOGL } from "react-ogl";
import src from "@/assets/ClashDisplay-Semibold.png";
import font from "@/assets/ClashDisplay-Semibold.json";
import fragment100 from "./frag100.frag";
import fragment300 from "./frag300.frag";
import vertex100 from "./vert100.vert";
import vertex300 from "./vert300.vert";
import { use, useEffect, useMemo, useRef, useState } from "react";

export const MSDFText = ({ text, test }: { text: string; test: number }) => {
  const { gl, renderer, scene, camera } = useOGL();
  const textMemo = useRef(
    new Text({
      align: "left",
      font,
      letterSpacing: 0,
      size: test / 6,
      lineHeight: 1,
      text: text,
      wordSpacing: 0,
    }),
  );

  const texture = new Texture(gl, { generateMipmaps: false });
  const textureImage = new Image();

  textureImage.src = src.src;
  textureImage.onload = (_) => (texture.image = textureImage);

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
      uColor: { value: new Color("#FFFFFF") },
      tMap: { value: texture },
      uWidth: { value: renderer.width },
      uHeight: { value: renderer.height },
      uDPR: { value: renderer.dpr },
      modelViewMatrix: { value: camera.viewMatrix },
      projectionMatrix: { value: camera.projectionMatrix },
    },
  });

  const sizeRef = useRef({ width: renderer.width, height: renderer.height });

  const renderText = new Text({
    align: "left",
    font,
    letterSpacing: 0,
    size: renderer.width / 6,
    lineHeight: 1,
    text: text,
    wordSpacing: 0,
  });

  const geometry = new Geometry(gl, {
    position: { size: 3, data: textMemo.current.buffers.position },
    uv: { size: 2, data: textMemo.current.buffers.uv },
    id: { size: 1, data: textMemo.current.buffers.id },
    index: { data: textMemo.current.buffers.index },
  });

  const mesh = new Mesh(gl, {
    geometry,
    program,
  });

  //   mesh.position.x = 0;
  //   mesh.position.y = 0;
  useEffect(() => {
    console.log(textMemo);
    console.log(src);
    geometry.computeBoundingBox();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      textMemo.current = new Text({
        align: "left",
        font,
        letterSpacing: 0,
        size: renderer.width / 6,
        lineHeight: 1,
        text: text,
        wordSpacing: 0,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useFrame(() => {
    program.uniforms.uWidth.value = renderer.width;
    program.uniforms.uHeight.value = renderer.height;
    program.uniforms.uDPR.value = renderer.dpr;
    console.log(camera.viewMatrix);
    console.log(camera.projectionMatrix);
    program.uniforms.modelViewMatrix.value = camera.viewMatrix;
    program.uniforms.projectionMatrix.value = camera.projectionMatrix;
    mesh.scale.x += 0.1;
    // textMemo.current.buffers.position.
    // textMemo.current = new Text({
    //   align: "left",
    //   font,
    //   letterSpacing: 0,
    //   size: renderer.width / 6,
    //   lineHeight: 1,
    //   text: text,
    //   wordSpacing: 0,
    // });
  });

  return mesh;
};
