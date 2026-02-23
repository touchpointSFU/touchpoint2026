import { useCallback, useEffect, useRef, useState } from "react";
import {
  PlaygroundCanvas,
  PlaygroundShaderRef,
} from "@/components/PlaygroundShader/PlaygroundShader";
import { useLocalStorage } from "@/hooks/useLocalStorage";

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
          .padStart(2, "0"),
      )
      .join("")
  );
}

const DEFAULTS = {
  blurAmount: 0,
  brightnessMultiplier: 1,
  gridSize: 36,
  targetColor: [1, 0.22, 0.88] as [number, number, number],
  secondColor: [0.83, 1, 0.49] as [number, number, number],
  bgColor: [0.83, 1, 0.49] as [number, number, number],
  dprMultiplier: 1,
};

export default function VisualPlayground() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [processedImageSrc, setProcessedImageSrc] = useState<string | null>(
    null,
  );
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [blurAmount, setBlurAmount, resetBlur] = useLocalStorage("playground-blur", DEFAULTS.blurAmount);
  const [brightnessMultiplier, setBrightnessMultiplier, resetBrightness] = useLocalStorage("playground-brightness", DEFAULTS.brightnessMultiplier);
  const [gridSize, setGridSize, resetGridSize] = useLocalStorage("playground-gridSize", DEFAULTS.gridSize);
  const [targetColor, setTargetColor, resetTargetColor] = useLocalStorage<[number, number, number]>("playground-targetColor", DEFAULTS.targetColor);
  const [secondColor, setSecondColor, resetSecondColor] = useLocalStorage<[number, number, number]>("playground-secondColor", DEFAULTS.secondColor);
  const [bgColor, setBgColor, resetBgColor] = useLocalStorage<[number, number, number]>("playground-bgColor", DEFAULTS.bgColor);
  const [dprMultiplier, setDprMultiplier, resetDpr] = useLocalStorage("playground-dpr", DEFAULTS.dprMultiplier);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<"original" | "blurred" | "final">(
    "final",
  );

  const handleReset = useCallback(() => {
    resetBlur();
    resetBrightness();
    resetGridSize();
    resetTargetColor();
    resetSecondColor();
    resetBgColor();
    resetDpr();
  }, [resetBlur, resetBrightness, resetGridSize, resetTargetColor, resetSecondColor, resetBgColor, resetDpr]);

  const canvasRef = useRef<PlaygroundShaderRef>(null);

  const loadImageWithAspectRatio = useCallback((dataUrl: string) => {
    const img = new Image();
    img.onload = () => {
      // Reset state for new image
      setProcessedImageSrc(null);
      setAspectRatio(img.naturalWidth / img.naturalHeight);
      setImageSrc(dataUrl);
      setViewMode("final");
    };
    img.src = dataUrl;
  }, []);

  // Preprocess image with blur and brightness
  useEffect(() => {
    if (!imageSrc) {
      setProcessedImageSrc(null);
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const filters = [];
        if (blurAmount > 0) {
          filters.push(`blur(${blurAmount}px)`);
        }
        if (brightnessMultiplier !== 1) {
          filters.push(`brightness(${brightnessMultiplier})`);
        }
        if (filters.length > 0) {
          ctx.filter = filters.join(" ");
        }
        ctx.drawImage(img, 0, 0);
        setProcessedImageSrc(canvas.toDataURL("image/png"));
      }
    };
    img.src = imageSrc;
  }, [imageSrc, blurAmount, brightnessMultiplier]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
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
    },
    [loadImageWithAspectRatio],
  );

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
    [loadImageWithAspectRatio],
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
          <p className="text-2xl text-pink-500 font-bold">
            Drop image anywhere
          </p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Preview Area */}
        <div className="flex-1">
          {processedImageSrc ? (
            <>
              {/* View Mode Tabs */}
              <div className="flex gap-1 mb-4 bg-neutral-800 p-1 rounded-lg w-fit">
                {(["original", "blurred", "final"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-4 py-2 rounded-md text-sm capitalize transition-colors ${
                      viewMode === mode
                        ? "bg-pink-500 text-white"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <div
                className="w-full max-w-2xl bg-neutral-800 rounded-lg overflow-hidden"
                style={{ aspectRatio: aspectRatio }}
              >
                {viewMode === "final" ? (
                  <PlaygroundCanvas
                    ref={canvasRef}
                    imageSrc={processedImageSrc}
                    gridSize={gridSize}
                    targetColor={targetColor}
                    secondColor={secondColor}
                    backgroundColor={bgColor}
                    dpr={dprMultiplier}
                  />
                ) : (
                  <img
                    src={
                      viewMode === "original" ? imageSrc! : processedImageSrc
                    }
                    alt={viewMode}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </>
          ) : (
            <div className="aspect-square w-full max-w-2xl border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors border-neutral-600 hover:border-neutral-500">
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
        </div>

        {/* Controls Panel */}
        <div className="w-full lg:w-80 space-y-6">
          <p className="text-sm text-neutral-500">
            Drop an image to apply the grid effect. Brightness values (0-1) map
            to cell pattern complexity.
          </p>

          <div>
            <label className="block text-sm text-neutral-400 mb-2">
              Blur (px)
            </label>
            <input
              type="number"
              min="0"
              max="50"
              step="5"
              value={blurAmount}
              onChange={(e) => setBlurAmount(Number(e.target.value))}
              className="w-full h-10 px-3 bg-neutral-700 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-2">
              Brightness: {brightnessMultiplier.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={brightnessMultiplier}
              onChange={(e) => setBrightnessMultiplier(Number(e.target.value))}
              className="w-full accent-pink-500"
            />
          </div>

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

          <div className="flex gap-2 pt-4">
            {processedImageSrc && (
              <button
                onClick={handleExport}
                className="flex-1 px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg transition-colors text-sm"
              >
                Export PNG
              </button>
            )}
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors text-sm"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
