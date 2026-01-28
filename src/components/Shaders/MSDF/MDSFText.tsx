import {
  Color,
  OGLRenderingContext,
  Program,
  Texture,
  Text,
  Geometry,
  Mesh,
} from "ogl";
import { render, useOGL } from "react-ogl";
import src from "@/assets/ClashDisplay-Semibold.png";
import font from "@/assets/ClashDisplay-Semibold.json";
import fragment100 from "./frag100.frag";
import fragment300 from "./frag300.frag";
import vertex100 from "./vert100.vert";
import vertex300 from "./vert300.vert";
import { useEffect } from "react";

export const MSDFText = ({ text }: { text: string }) => {
  const { gl, plane, renderer } = useOGL();

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
      uColor: { value: new Color("#545050") },
      tMap: { value: texture },
    },
  });

  const renderText = new Text({
    align: "center",
    font,
    letterSpacing: -0.05,
    size: 1,
    text: text,
    wordSpacing: 0,
  });

  const geometry = new Geometry(gl, {
    position: { size: 3, data: renderText.buffers.position },
    uv: { size: 2, data: renderText.buffers.uv },
    id: { size: 1, data: renderText.buffers.id },
    index: { data: renderText.buffers.index },
  });

  useEffect(() => {
    console.log(renderText);
    console.log(src);
    geometry.computeBoundingBox();
  }, []);

  //   const mesh = new Mesh(gl, {
  //     geometry,
  //     program,
  //   });

  return <mesh geometry={geometry} program={program} />;
};
