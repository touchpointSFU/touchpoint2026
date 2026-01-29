import {
  Color,
  OGLRenderingContext,
  Program,
  Texture,
  Text,
  Geometry,
  Mesh,
} from "ogl";
import { render, useFrame, useOGL } from "react-ogl";
import src from "@/assets/ClashDisplay-Semibold.png";
import font from "@/assets/ClashDisplay-Semibold.json";
import fragment100 from "./frag100.frag";
import fragment300 from "./frag300.frag";
import vertex100 from "./vert100.vert";
import vertex300 from "./vert300.vert";
import { useEffect } from "react";

export const MSDFText = ({ text, plane }: { text: string; plane: any }) => {
  const { gl, renderer, scene } = useOGL();

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
    },
  });

  const renderText = new Text({
    align: "left",
    font,
    letterSpacing: 0,
    size: 1,
    lineHeight: 1,
    text: text,
    wordSpacing: 0,
  });

  const geometry = new Geometry(gl, {
    position: { size: 3, data: renderText.buffers.position },
    uv: { size: 2, data: renderText.buffers.uv },
    id: { size: 1, data: renderText.buffers.id },
    index: { data: renderText.buffers.index },
  });

  const mesh = new Mesh(gl, {
    geometry,
    program,
  });

  const planeNew = new Mesh(gl, {
    geometry: plane,
    program: new Program(gl, {
      vertex: `
        attribute vec3 position;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        void main() {
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
      `,
    }),
  });
  mesh.position.x = 0;
  mesh.position.y = 0;
  useEffect(() => {
    console.log(renderText);
    console.log(src);
    geometry.computeBoundingBox();
    // planeNew.setParent(scene);
    console.log(planeNew);
  }, []);

  return mesh;
};
