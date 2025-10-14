import React, { useState, useRef, useEffect } from "react";
import { Upload, Eraser, Undo, Redo, Download, Trash2 } from "lucide-react";
import * as tf from "@tensorflow/tfjs";

const ObjectRemoval = () => {
  const [image, setImage] = useState(null);
  const [brushSize, setBrushSize] = useState(20);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef(null);
  const maskCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    // Initialize TensorFlow.js
    tf.ready();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Wait for next render cycle to ensure refs are available
          requestAnimationFrame(() => {
            const canvas = canvasRef.current;
            const maskCanvas = maskCanvasRef.current;

            if (!canvas || !maskCanvas) {
              console.error("Canvas refs not available");
              return;
            }

            const ctx = canvas.getContext("2d");
            const maskCtx = maskCanvas.getContext("2d");

            // Set canvas dimensions
            canvas.width = img.width;
            canvas.height = img.height;
            maskCanvas.width = img.width;
            maskCanvas.height = img.height;

            // Draw image
            ctx.drawImage(img, 0, 0);

            // Clear mask
            maskCtx.fillStyle = "black";
            maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

            // Save initial state to history
            const initialHistory = [
              {
                imageData: canvas.toDataURL(),
                maskData: maskCanvas.toDataURL(),
              },
            ];
            setHistory(initialHistory);
            setHistoryIndex(0);
          });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
      setImage(true); // Set image state to trigger render
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

  const restoreFromHistory = (index) => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const maskCtx = maskCanvas.getContext("2d");

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

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const draw = (e) => {
    if (!isDrawing && e.type !== "mousedown" && e.type !== "touchstart") return;

    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    const rect = canvas.getBoundingClientRect();

    let x, y;
    if (e.type.includes("touch")) {
      x = (e.touches[0].clientX - rect.left) * (canvas.width / rect.width);
      y = (e.touches[0].clientY - rect.top) * (canvas.height / rect.height);
    } else {
      x = (e.clientX - rect.left) * (canvas.width / rect.width);
      y = (e.clientY - rect.top) * (canvas.height / rect.height);
    }

    const maskCtx = maskCanvas.getContext("2d");
    maskCtx.fillStyle = "white";
    maskCtx.beginPath();
    maskCtx.arc(x, y, brushSize, 0, Math.PI * 2);
    maskCtx.fill();

    // Show visual feedback on main canvas
    const ctx = canvas.getContext("2d");
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  };

  const performInpainting = async () => {
    if (!image) return;

    setIsProcessing(true);
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    const ctx = canvas.getContext("2d");

    try {
      // Get image and mask data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const maskCtx = maskCanvas.getContext("2d");
      const maskData = maskCtx.getImageData(
        0,
        0,
        maskCanvas.width,
        maskCanvas.height
      );

      // Convert to tensors
      const imageTensor = tf.browser.fromPixels(imageData);
      const maskTensor = tf.browser.fromPixels(maskData).mean(2).expandDims(2);

      // Normalize
      const normalizedMask = maskTensor.greater(0.5);

      // Simple inpainting using surrounding pixels
      const result = await inpaintSimple(
        imageTensor,
        normalizedMask,
        canvas.width,
        canvas.height
      );

      // Draw result back to canvas
      await tf.browser.toPixels(result, canvas);

      // Clear mask
      maskCtx.fillStyle = "black";
      maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

      saveToHistory();

      // Cleanup
      imageTensor.dispose();
      maskTensor.dispose();
      normalizedMask.dispose();
      result.dispose();
    } catch (error) {
      console.error("Inpainting error:", error);
      alert("Error processing image. Please try again.");
    }

    setIsProcessing(false);
  };

  const inpaintSimple = async (imageTensor, maskTensor, width, height) => {
    return tf.tidy(() => {
      // Get the inverse mask (areas to keep)
      const inverseMask = tf.logicalNot(maskTensor).cast("float32");

      // Apply Gaussian blur to smooth boundaries
      const blurred = imageTensor.conv2d(
        tf
          .tensor4d(
            [
              [1 / 16, 2 / 16, 1 / 16],
              [2 / 16, 4 / 16, 2 / 16],
              [1 / 16, 2 / 16, 1 / 16],
            ],
            [3, 3, 1, 1]
          )
          .tile([1, 1, 3, 1]),
        1,
        "same"
      );

      // Combine original and blurred based on mask
      const result = imageTensor
        .mul(inverseMask)
        .add(blurred.mul(maskTensor.cast("float32")));

      return result.clipByValue(0, 255).cast("int32");
    });
  };

  const clearMask = () => {
    const maskCanvas = maskCanvasRef.current;
    const canvas = canvasRef.current;
    if (!maskCanvas || !image) return;

    const maskCtx = maskCanvas.getContext("2d");
    maskCtx.fillStyle = "black";
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    saveToHistory();
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Object Removal Tool
          </h1>
          <p className="text-gray-600 mb-6">
            Upload an image, mark objects to remove, and let AI fill the gaps
            seamlessly
          </p>

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
                  disabled={isProcessing}
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
              <li>Upload an image using the "Upload Image" button</li>
              <li>Adjust the brush size using the slider</li>
              <li>
                Draw over the objects you want to remove (they'll appear in red)
              </li>
              <li>Use Undo/Redo to correct mistakes</li>
              <li>
                Click "Remove Objects" to process the image with AI-assisted
                fill
              </li>
              <li>Download your edited image when satisfied</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectRemoval;
