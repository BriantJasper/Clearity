import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Eraser,
  Undo,
  Redo,
  Download,
  Trash2,
  Key,
} from "lucide-react";

interface HistoryState {
  imageData: string;
  maskData: string;
}

const ObjectRemoval = () => {
  const [image, setImage] = useState<string | null>(null);
  const [brushSize, setBrushSize] = useState(20);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState(
    import.meta.env.VITE_CLIPDROP_API_KEY || ""
  );
  const [showApiInput, setShowApiInput] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          requestAnimationFrame(() => {
            const canvas = canvasRef.current;
            const maskCanvas = maskCanvasRef.current;

            if (!canvas || !maskCanvas) return;

            const ctx = canvas.getContext("2d");
            const maskCtx = maskCanvas.getContext("2d");

            if (!ctx || !maskCtx) return;

            // Limit canvas size for better performance
            const maxSize = 1024;
            let width = img.width;
            let height = img.height;

            if (width > maxSize || height > maxSize) {
              if (width > height) {
                height = (height / width) * maxSize;
                width = maxSize;
              } else {
                width = (width / height) * maxSize;
                height = maxSize;
              }
            }

            canvas.width = width;
            canvas.height = height;
            maskCanvas.width = width;
            maskCanvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            maskCtx.fillStyle = "black";
            maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

            const initialHistory: HistoryState[] = [
              {
                imageData: canvas.toDataURL(),
                maskData: maskCanvas.toDataURL(),
              },
            ];
            setHistory(initialHistory);
            setHistoryIndex(0);
          });
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !maskCanvas) return;

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      imageData: canvas.toDataURL(),
      maskData: maskCanvas.toDataURL(),
    });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      restoreFromHistory(newIndex);
      setHistoryIndex(newIndex);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      restoreFromHistory(newIndex);
      setHistoryIndex(newIndex);
    }
  };

  const restoreFromHistory = (index: number) => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !maskCanvas) return;

    const ctx = canvas.getContext("2d");
    const maskCtx = maskCanvas.getContext("2d");
    if (!ctx || !maskCtx) return;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
    };
    img.src = history[index].imageData;

    const maskImg = new Image();
    maskImg.onload = () => {
      maskCtx.drawImage(maskImg, 0, 0);
    };
    maskImg.src = history[index].maskData;
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing && e.type !== "mousedown" && e.type !== "touchstart") return;

    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !maskCanvas) return;

    const rect = canvas.getBoundingClientRect();

    let x: number, y: number;
    if (e.type.includes("touch")) {
      const touchEvent = e as React.TouchEvent<HTMLCanvasElement>;
      x =
        (touchEvent.touches[0].clientX - rect.left) *
        (canvas.width / rect.width);
      y =
        (touchEvent.touches[0].clientY - rect.top) *
        (canvas.height / rect.height);
    } else {
      const mouseEvent = e as React.MouseEvent<HTMLCanvasElement>;
      x = (mouseEvent.clientX - rect.left) * (canvas.width / rect.width);
      y = (mouseEvent.clientY - rect.top) * (canvas.height / rect.height);
    }

    const maskCtx = maskCanvas.getContext("2d");
    if (!maskCtx) return;

    maskCtx.fillStyle = "white";
    maskCtx.beginPath();
    maskCtx.arc(x, y, brushSize, 0, Math.PI * 2);
    maskCtx.fill();

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  };

  const performInpainting = async () => {
    if (!image || !apiKey) {
      alert("Please provide your Clipdrop API key first!");
      setShowApiInput(true);
      return;
    }

    setIsProcessing(true);
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !maskCanvas) {
      setIsProcessing(false);
      return;
    }

    try {
      // Save the original image data without the red overlay
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Load original image to get clean version
      const originalImg = new Image();
      await new Promise<void>((resolve) => {
        originalImg.onload = () => {
          ctx.drawImage(originalImg, 0, 0);
          resolve();
        };
        originalImg.src = history[0].imageData; // Get original from history
      });

      // Convert clean canvas to blob
      const imageBlob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), "image/png");
      });

      const maskBlob = await new Promise<Blob>((resolve) => {
        maskCanvas.toBlob((blob) => resolve(blob!), "image/png");
      });

      // Call Clipdrop API
      const formData = new FormData();
      formData.append("image_file", imageBlob, "image.png");
      formData.append("mask_file", maskBlob, "mask.png");

      const response = await fetch("https://clipdrop-api.co/cleanup/v1", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`API Error (${response.status}): ${error}`);
      }

      const resultBlob = await response.blob();
      const resultUrl = URL.createObjectURL(resultBlob);

      // Load result back to canvas
      const resultImg = new Image();
      resultImg.onload = () => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(resultImg, 0, 0, canvas.width, canvas.height);

        // Clear mask
        const maskCtx = maskCanvas.getContext("2d");
        if (maskCtx) {
          maskCtx.fillStyle = "black";
          maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
        }

        saveToHistory();
        URL.revokeObjectURL(resultUrl);
      };
      resultImg.src = resultUrl;
    } catch (error) {
      console.error("Inpainting error:", error);
      alert(
        `Error: ${
          error instanceof Error ? error.message : "Failed to process image"
        }. \n\nTip: Make sure your API key is valid.`
      );
    }

    setIsProcessing(false);
  };

  const clearMask = () => {
    const maskCanvas = maskCanvasRef.current;
    const canvas = canvasRef.current;
    if (!maskCanvas || !canvas || !image) return;

    const maskCtx = maskCanvas.getContext("2d");
    const ctx = canvas.getContext("2d");
    if (!maskCtx || !ctx) return;

    maskCtx.fillStyle = "black";
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

    const img = new Image();
    img.onload = () => {
      if (canvas && ctx) {
        ctx.drawImage(img, 0, 0);
        saveToHistory();
      }
    };
    img.src = image;
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `object-removed-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            AI Object Removal Tool
          </h1>
          <p className="text-gray-600 mb-6">
            Upload an image and paint over objects to remove them using Clipdrop
            AI
          </p>

          {/* API Key Section */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <Key size={20} />
                Clipdrop API Key
              </h3>
              <button
                onClick={() => setShowApiInput(!showApiInput)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {showApiInput ? "Hide" : "Show"}
              </button>
            </div>
            {showApiInput && (
              <div className="space-y-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Clipdrop API key"
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-blue-700">
                  Get your free API key from{" "}
                  <a
                    href="https://clipdrop.co/apis/pricing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    Clipdrop API
                  </a>{" "}
                  (Free tier: 100 requests/month)
                </p>
              </div>
            )}
            {apiKey && !showApiInput && (
              <p className="text-sm text-green-700">✓ API key configured</p>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Upload size={20} />
              Upload Image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {image && (
              <>
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Undo size={20} />
                  Undo
                </button>

                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Redo size={20} />
                  Redo
                </button>

                <button
                  onClick={clearMask}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                >
                  <Trash2 size={20} />
                  Clear Mask
                </button>

                <button
                  onClick={performInpainting}
                  disabled={isProcessing || !apiKey}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Eraser size={20} />
                  {isProcessing ? "Processing..." : "Remove Objects"}
                </button>

                <button
                  onClick={downloadImage}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  <Download size={20} />
                  Download
                </button>
              </>
            )}
          </div>

          {/* Brush Size Control */}
          {image && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brush Size: {brushSize}px
              </label>
              <input
                type="range"
                min="5"
                max="100"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}

          {/* Canvas Area */}
          <div
            className="relative bg-gray-100 rounded-lg overflow-hidden"
            style={{ minHeight: "400px" }}
          >
            {!image ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">
                    Upload an image to get started
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center p-4">
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="max-w-full h-auto border-2 border-gray-300 rounded cursor-crosshair"
                    style={{ touchAction: "none" }}
                  />
                </div>
              </div>
            )}
            <canvas ref={maskCanvasRef} className="hidden" />
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
            <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
              <li>Get a free API key from Clipdrop and enter it above</li>
              <li>Upload an image using the "Upload Image" button</li>
              <li>Adjust the brush size using the slider</li>
              <li>
                Paint over the objects you want to remove (they'll appear in
                red)
              </li>
              <li>Use Undo/Redo to correct mistakes</li>
              <li>Click "Remove Objects" to process with Clipdrop AI</li>
              <li>Download your edited image when satisfied</li>
            </ol>
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-green-800 text-sm">
                <strong>✨ AI-Powered:</strong> This tool uses Clipdrop's
                Cleanup API which intelligently fills in removed areas with
                realistic content based on the surrounding context. Free tier
                includes 100 requests/month!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectRemoval;
