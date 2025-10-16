import React, { useState, useRef } from "react";
import {
  Upload,
  Eraser,
  Undo,
  Redo,
  Download,
  Trash2,
  Wand2,
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

  const dataURLtoBlob = (dataURL: string): Blob => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const performInpainting = async () => {
    if (!image) {
      alert("Please upload an image first!");
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
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const originalImg = new Image();
      await new Promise<void>((resolve) => {
        originalImg.onload = () => {
          ctx.drawImage(originalImg, 0, 0);
          resolve();
        };
        originalImg.src = history[0].imageData;
      });

      const imageBlob = dataURLtoBlob(canvas.toDataURL("image/png"));
      const maskBlob = dataURLtoBlob(maskCanvas.toDataURL("image/png"));

      const formData = new FormData();
      formData.append("image", imageBlob, "image.png");
      formData.append("mask", maskBlob, "mask.png");

      const response = await fetch("http://localhost:5000/api/remove-object", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`API Error (${response.status}): ${error}`);
      }

      const resultBlob = await response.blob();
      const resultUrl = URL.createObjectURL(resultBlob);

      const resultImg = new Image();
      resultImg.onload = () => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(resultImg, 0, 0, canvas.width, canvas.height);

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
        }. \n\nPlease make sure your backend server is running on port 5000.`
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
    <div className="w-full">
      {/* Controls Section */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Upload size={18} className="group-hover:animate-bounce" />
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
                className="flex items-center gap-2 px-4 py-2.5 bg-white/70 backdrop-blur-sm text-gray-700 rounded-lg font-medium border border-gray-200 hover:bg-white hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                <Undo size={18} />
                Undo
              </button>

              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/70 backdrop-blur-sm text-gray-700 rounded-lg font-medium border border-gray-200 hover:bg-white hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                <Redo size={18} />
                Redo
              </button>

              <button
                onClick={clearMask}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/70 backdrop-blur-sm text-gray-700 rounded-lg font-medium border border-gray-200 hover:bg-white hover:shadow-md transition-all"
              >
                <Trash2 size={18} />
                Clear Mask
              </button>

              <button
                onClick={performInpainting}
                disabled={isProcessing}
                className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Wand2
                  size={18}
                  className={isProcessing ? "animate-spin" : ""}
                />
                {isProcessing ? "Processing..." : "Remove Objects"}
              </button>

              <button
                onClick={downloadImage}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all"
              >
                <Download size={18} />
                Download
              </button>
            </>
          )}
        </div>

        {/* Brush Size Control */}
        {image && (
          <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-700">
                Brush Size
              </label>
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {brushSize}px
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Small</span>
              <span>Large</span>
            </div>
          </div>
        )}
      </div>

      {/* Canvas Area */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200/50 shadow-lg overflow-hidden">
        {!image ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload size={32} className="text-blue-600" />
              </div>
              <p className="text-gray-600 font-medium">
                Upload an image to get started
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Drag and drop or click to select
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center p-6">
            <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
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
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50 p-6 shadow-sm">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
            ?
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">How to use:</h3>
            <ol className="space-y-2 text-gray-700 text-sm">
              <li className="flex gap-2">
                <span className="font-semibold text-blue-600 min-w-max">
                  1.
                </span>
                <span>Upload an image using the "Upload Image" button</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-blue-600 min-w-max">
                  2.
                </span>
                <span>Adjust the brush size using the slider</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-blue-600 min-w-max">
                  3.
                </span>
                <span>
                  Paint over the objects you want to remove (they'll appear in
                  red)
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-blue-600 min-w-max">
                  4.
                </span>
                <span>Use Undo/Redo to correct mistakes</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-blue-600 min-w-max">
                  5.
                </span>
                <span>Click "Remove Objects" to process with AI</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-blue-600 min-w-max">
                  6.
                </span>
                <span>Download your edited image when satisfied</span>
              </li>
            </ol>
          </div>
        </div>

        <div className="mt-4 p-3 bg-white/60 backdrop-blur-sm border border-blue-200 rounded-lg">
          <p className="text-gray-700 text-sm">
            <span className="font-semibold text-blue-600">✨ AI-Powered:</span>{" "}
            This tool uses Clipdrop's Cleanup API which intelligently fills in
            removed areas with realistic content based on the surrounding
            context.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ObjectRemoval;
