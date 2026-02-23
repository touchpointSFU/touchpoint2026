import { Texture } from "ogl";
import { Suspense, useEffect, useLayoutEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Canvas, useOGL } from "react-ogl";
import playgroundVert from "./playground.vert";
import playgroundFrag from "./playground.frag";

export interface PlaygroundShaderRef {
  exportImage: () => string | null;
}

interface PlaygroundShaderProps {
  imageSrc: string;
  gridSize: number;
  targetColor: [number, number, number];
  secondColor: [number, number, number];
  backgroundColor: [number, number, number];
  dpr?: number;
}

export const PlaygroundCanvas = forwardRef<PlaygroundShaderRef, PlaygroundShaderProps>(
  ({ imageSrc, gridSize, targetColor, secondColor, backgroundColor, dpr = 1 }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useImperativeHandle(ref, () => ({
      exportImage: () => {
        if (canvasRef.current) {
          return canvasRef.current.toDataURL("image/png");
        }
        return null;
      },
    }));

    return (
      <Canvas
        key={dpr}
        orthographic
        dpr={dpr}
        renderer={{ preserveDrawingBuffer: true }}
        onCreated={({ gl }) => {
          canvasRef.current = gl.canvas as HTMLCanvasElement;
        }}
      >
        <Suspense fallback={null}>
          <PlaygroundShader
            imageSrc={imageSrc}
            gridSize={gridSize}
            targetColor={targetColor}
            secondColor={secondColor}
            backgroundColor={backgroundColor}
          />
        </Suspense>
      </Canvas>
    );
  }
);

PlaygroundCanvas.displayName = "PlaygroundCanvas";

const PlaygroundShader = ({
  imageSrc,
  gridSize,
  targetColor,
  secondColor,
  backgroundColor,
}: PlaygroundShaderProps) => {
  const { gl, renderer } = useOGL();
  const [texture, setTexture] = useState<Texture>(
    new Texture(gl, {
      generateMipmaps: false,
    })
  );

  const uniforms = useRef({
    uTexture: { value: texture },
    uBackground: { value: backgroundColor },
    uTargetColor: { value: targetColor },
    uSecondColor: { value: secondColor },
    uGridSize: { value: gridSize },
    uResolution: { value: [renderer.width, renderer.height] },
  });

  useEffect(() => {
    const tex = new Texture(gl, {
      generateMipmaps: false,
    });
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      tex.image = img;
      setTexture(tex);
      uniforms.current.uTexture.value = tex;
    };
  }, [gl, imageSrc]);

  useEffect(() => {
    uniforms.current.uGridSize.value = gridSize;
  }, [gridSize]);

  useEffect(() => {
    uniforms.current.uTargetColor.value = targetColor;
  }, [targetColor]);

  useEffect(() => {
    uniforms.current.uSecondColor.value = secondColor;
  }, [secondColor]);

  useEffect(() => {
    uniforms.current.uBackground.value = backgroundColor;
  }, [backgroundColor]);

  useLayoutEffect(() => {
    const handleResize = () => {
      uniforms.current.uResolution.value = [renderer.width, renderer.height];
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderer]);

  return (
    <mesh>
      <triangle />
      <program
        vertex={playgroundVert}
        fragment={playgroundFrag}
        uniforms={uniforms.current}
      />
    </mesh>
  );
};

export default PlaygroundShader;
