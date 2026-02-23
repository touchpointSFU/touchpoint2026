import { useCallback, useRef, useState } from "react";
import {
  PlaygroundCanvas,
  PlaygroundShaderRef,
} from "@/components/PlaygroundShader/PlaygroundShader";

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      ]
    : [0, 0, 0];
}

function rgbToHex(rgb: [number, number, number]): string {
  return (
    "#" +
    rgb
      .map((c) =>
        Math.round(c * 255)
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
}

export default function VisualPlayground() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [gridSize, setGridSize] = useState(36);
  const [targetColor, setTargetColor] = useState<[number, number, number]>([
    1, 0.22, 0.88,
  ]);
  const [secondColor, setSecondColor] = useState<[number, number, number]>([
    0.83, 1, 0.49,
  ]);
  const [bgColor, setBgColor] = useState<[number, number, number]>([
    0.83, 1, 0.49,
  ]);
  const [dprMultiplier, setDprMultiplier] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const canvasRef = useRef<PlaygroundShaderRef>(null);

  const loadImageWithAspectRatio = useCallback((dataUrl: string) => {
    const img = new Image();
    img.onload = () => {
      setAspectRatio(img.naturalWidth / img.naturalHeight);
      setImageSrc(dataUrl);
    };
    img.src = dataUrl;
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        loadImageWithAspectRatio(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [loadImageWithAspectRatio]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          loadImageWithAspectRatio(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [loadImageWithAspectRatio]
  );

  const handleExport = useCallback(() => {
    const dataUrl = canvasRef.current?.exportImage();
    if (dataUrl) {
      const link = document.createElement("a");
      link.download = "grid-effect.png";
      link.href = dataUrl;
      link.click();
    }
  }, []);

  return (
    <div
      className="min-h-dvh bg-neutral-900 text-white p-8 relative"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Global drop overlay */}
      {isDragging && (
        <div className="fixed inset-0 bg-pink-500/20 border-4 border-dashed border-pink-500 z-50 flex items-center justify-center pointer-events-none">
          <p className="text-2xl text-pink-500 font-bold">Drop image anywhere</p>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-8">Visual Playground</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Preview Area */}
        <div className="flex-1">
          {imageSrc ? (
            <div
              className="w-full max-w-2xl bg-neutral-800 rounded-lg overflow-hidden"
              style={{ aspectRatio: aspectRatio }}
            >
              <PlaygroundCanvas
                ref={canvasRef}
                imageSrc={imageSrc}
                gridSize={gridSize}
                targetColor={targetColor}
                secondColor={secondColor}
                backgroundColor={bgColor}
                dpr={dprMultiplier}
              />
            </div>
          ) : (
            <div
              className="aspect-square w-full max-w-2xl border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors border-neutral-600 hover:border-neutral-500"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="cursor-pointer text-center p-8"
              >
                <div className="text-4xl mb-4">+</div>
                <p className="text-neutral-400">
                  Drop a PNG anywhere or click to upload
                </p>
              </label>
            </div>
          )}

          {imageSrc && (
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleExport}
                className="px-6 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg transition-colors"
              >
                Export PNG
              </button>
              <button
                onClick={() => {
                  setImageSrc(null);
                  setAspectRatio(1);
                }}
                className="px-6 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Controls Panel */}
        <div className="w-full lg:w-80 space-y-6">
          <div>
            <label className="block text-sm text-neutral-400 mb-2">
              Export Resolution: {dprMultiplier}x
            </label>
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              value={dprMultiplier}
              onChange={(e) => setDprMultiplier(Number(e.target.value))}
              className="w-full accent-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-2">
              Grid Size: {gridSize}px
            </label>
            <input
              type="range"
              min="12"
              max="96"
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              className="w-full accent-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-2">
              Target Color (Primary)
            </label>
            <input
              type="color"
              value={rgbToHex(targetColor)}
              onChange={(e) => setTargetColor(hexToRgb(e.target.value))}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-2">
              Secondary Color
            </label>
            <input
              type="color"
              value={rgbToHex(secondColor)}
              onChange={(e) => setSecondColor(hexToRgb(e.target.value))}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-2">
              Background Color
            </label>
            <input
              type="color"
              value={rgbToHex(bgColor)}
              onChange={(e) => setBgColor(hexToRgb(e.target.value))}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>

          <div className="pt-4 border-t border-neutral-700">
            <p className="text-sm text-neutral-500">
              Drop an image to apply the grid effect. Brightness values (0-1)
              map to cell pattern complexity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
