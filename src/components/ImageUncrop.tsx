import React, { useState, useRef } from "react";
import {
  Upload,
  Download,
  Maximize2,
  Loader2,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  XCircle,
} from "lucide-react";

const ImageUncrop = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [uncroppedImage, setUncroppedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [extendLeft, setExtendLeft] = useState(0);
  const [extendRight, setExtendRight] = useState(0);
  const [extendUp, setExtendUp] = useState(0);
  const [extendDown, setExtendDown] = useState(0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      setUncroppedImage(null);
      setOriginalImage(URL.createObjectURL(file));
      setExtendLeft(0);
      setExtendRight(0);
      setExtendUp(0);
      setExtendDown(0);
    }
  };

  const handleUncrop = async () => {
    if (!originalImage) {
      setError("Please upload an image first!");
      return;
    }

    if (
      extendLeft === 0 &&
      extendRight === 0 &&
      extendUp === 0 &&
      extendDown === 0
    ) {
      setError("Please set at least one extension direction!");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch(originalImage);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("image", blob, "image.jpg");
      formData.append("extend_left", extendLeft.toString());
      formData.append("extend_right", extendRight.toString());
      formData.append("extend_up", extendUp.toString());
      formData.append("extend_down", extendDown.toString());

      const apiResponse = await fetch(
        "http://localhost:5000/api/uncrop-image",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        throw new Error(`Failed to uncrop image: ${errorText}`);
      }

      const resultBlob = await apiResponse.blob();
      const resultUrl = URL.createObjectURL(resultBlob);
      setUncroppedImage(resultUrl);
    } catch (err) {
      console.error("Uncrop error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to uncrop image. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!uncroppedImage) return;

    const link = document.createElement("a");
    link.download = `uncropped-${Date.now()}.jpg`;
    link.href = uncroppedImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAll = () => {
    setOriginalImage(null);
    setUncroppedImage(null);
    setError(null);
    setExtendLeft(0);
    setExtendRight(0);
    setExtendUp(0);
    setExtendDown(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const adjustExtension = (direction: string, value: number) => {
    const newValue = Math.max(0, Math.min(2000, value));
    switch (direction) {
      case "left":
        setExtendLeft(newValue);
        break;
      case "right":
        setExtendRight(newValue);
        break;
      case "up":
        setExtendUp(newValue);
        break;
      case "down":
        setExtendDown(newValue);
        break;
    }
  };

  const quickExpand = (amount: number) => {
    setExtendLeft((prev) => Math.max(0, Math.min(2000, prev + amount)));
    setExtendRight((prev) => Math.max(0, Math.min(2000, prev + amount)));
    setExtendUp((prev) => Math.max(0, Math.min(2000, prev + amount)));
    setExtendDown((prev) => Math.max(0, Math.min(2000, prev + amount)));
  };

  return (
    <div className="w-full">
      {/* Controls Section */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Upload size={18} className="group-hover:animate-bounce" />
            {originalImage ? "Change Image" : "Upload Image"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {originalImage && (
            <div className="flex gap-2 ml-auto">
              <button
                onClick={handleUncrop}
                disabled={isProcessing}
                className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Maximize2 size={18} />
                    Expand Image
                  </>
                )}
              </button>

              {uncroppedImage && (
                <button
                  onClick={downloadImage}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all"
                >
                  <Download size={18} />
                  Download
                </button>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50/80 backdrop-blur-sm border border-red-200/60 rounded-lg flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Extension Controls */}
      {originalImage && (
        <div className="mb-8 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-emerald-600" />
            Expansion Settings
          </h3>

          {/* Quick Expand All */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Quick Expand All Sides
            </label>
            <div className="flex flex-wrap gap-2">
              {[100, 250, 500, 1000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => quickExpand(amount)}
                  className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-200 transition-all border border-emerald-200/50"
                >
                  +{amount}px
                </button>
              ))}
              <button
                onClick={() => {
                  setExtendLeft(0);
                  setExtendRight(0);
                  setExtendUp(0);
                  setExtendDown(0);
                }}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-all border border-gray-200 flex items-center gap-1"
              >
                <RotateCcw size={14} />
                Reset
              </button>
            </div>
          </div>

          {/* Extension Controls */}
          <div className="space-y-4">
            {/* Top */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <ArrowUp className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <label className="text-xs font-semibold text-gray-700 w-12 uppercase">
                  Top
                </label>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={extendUp}
                  onChange={(e) =>
                    adjustExtension("up", Number(e.target.value))
                  }
                  className="flex-1 h-2 bg-gradient-to-r from-emerald-200 to-green-500 rounded-full appearance-none cursor-pointer accent-emerald-600"
                />
                <input
                  type="number"
                  min="0"
                  max="2000"
                  value={extendUp}
                  onChange={(e) =>
                    adjustExtension("up", Number(e.target.value))
                  }
                  className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-center text-xs font-semibold text-gray-700 bg-white/50"
                />
                <span className="text-xs text-gray-500 w-6">px</span>
              </div>
            </div>

            {/* Left */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <ArrowLeft className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <label className="text-xs font-semibold text-gray-700 w-12 uppercase">
                  Left
                </label>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={extendLeft}
                  onChange={(e) =>
                    adjustExtension("left", Number(e.target.value))
                  }
                  className="flex-1 h-2 bg-gradient-to-r from-emerald-200 to-green-500 rounded-full appearance-none cursor-pointer accent-emerald-600"
                />
                <input
                  type="number"
                  min="0"
                  max="2000"
                  value={extendLeft}
                  onChange={(e) =>
                    adjustExtension("left", Number(e.target.value))
                  }
                  className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-center text-xs font-semibold text-gray-700 bg-white/50"
                />
                <span className="text-xs text-gray-500 w-6">px</span>
              </div>
            </div>

            {/* Right */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <ArrowRight className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <label className="text-xs font-semibold text-gray-700 w-12 uppercase">
                  Right
                </label>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={extendRight}
                  onChange={(e) =>
                    adjustExtension("right", Number(e.target.value))
                  }
                  className="flex-1 h-2 bg-gradient-to-r from-emerald-200 to-green-500 rounded-full appearance-none cursor-pointer accent-emerald-600"
                />
                <input
                  type="number"
                  min="0"
                  max="2000"
                  value={extendRight}
                  onChange={(e) =>
                    adjustExtension("right", Number(e.target.value))
                  }
                  className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-center text-xs font-semibold text-gray-700 bg-white/50"
                />
                <span className="text-xs text-gray-500 w-6">px</span>
              </div>
            </div>

            {/* Bottom */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <ArrowDown className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <label className="text-xs font-semibold text-gray-700 w-12 uppercase">
                  Bottom
                </label>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={extendDown}
                  onChange={(e) =>
                    adjustExtension("down", Number(e.target.value))
                  }
                  className="flex-1 h-2 bg-gradient-to-r from-emerald-200 to-green-500 rounded-full appearance-none cursor-pointer accent-emerald-600"
                />
                <input
                  type="number"
                  min="0"
                  max="2000"
                  value={extendDown}
                  onChange={(e) =>
                    adjustExtension("down", Number(e.target.value))
                  }
                  className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-center text-xs font-semibold text-gray-700 bg-white/50"
                />
                <span className="text-xs text-gray-500 w-6">px</span>
              </div>
            </div>
          </div>

          {/* Total Extension Info */}
          {(extendLeft > 0 ||
            extendRight > 0 ||
            extendUp > 0 ||
            extendDown > 0) && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200/50 rounded-lg">
              <p className="text-xs text-emerald-800 text-center">
                Total expansion:{" "}
                <span className="font-semibold">
                  {extendLeft + extendRight}px horizontal,{" "}
                  {extendUp + extendDown}
                  px vertical
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Image Display Area */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200/50 shadow-lg overflow-hidden mb-8">
        {!originalImage ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Maximize2 size={32} className="text-emerald-600" />
            </div>
            <p className="text-gray-600 font-medium">No image uploaded yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Click "Upload Image" to get started
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original Image */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Original Image
                </h3>
                <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm">
                  <img
                    src={originalImage}
                    alt="Original"
                    className="w-full h-auto object-contain"
                    style={{ maxHeight: "500px" }}
                  />
                </div>
              </div>

              {/* Expanded Image */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Expanded Image
                  </h3>
                  {uncroppedImage && (
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Sparkles size={12} />
                      AI Extended
                    </span>
                  )}
                </div>
                <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm">
                  {isProcessing ? (
                    <div className="flex flex-col items-center justify-center h-96">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 flex items-center justify-center mb-4">
                        <Loader2
                          size={24}
                          className="text-emerald-600 animate-spin"
                        />
                      </div>
                      <p className="text-gray-700 font-medium">
                        Expanding your image...
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        AI is generating new content
                      </p>
                    </div>
                  ) : uncroppedImage ? (
                    <img
                      src={uncroppedImage}
                      alt="Expanded"
                      className="w-full h-auto object-contain"
                      style={{ maxHeight: "500px" }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-96">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <Maximize2 size={24} className="text-gray-300" />
                      </div>
                      <p className="text-gray-400">
                        Expanded image will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reset Button */}
      {originalImage && (
        <div className="mb-8">
          <button
            onClick={resetAll}
            className="w-full py-2.5 bg-white/70 backdrop-blur-sm text-gray-700 rounded-lg font-medium border border-gray-200 hover:bg-white hover:shadow-md transition-all"
          >
            Reset & Start Over
          </button>
        </div>
      )}

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/50 p-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg flex items-center justify-center mb-3">
            <Maximize2 className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm mb-1.5">
            Expand Any Direction
          </h3>
          <p className="text-gray-600 text-xs leading-relaxed">
            Add up to 2000px in any direction - top, bottom, left, or right
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/50 p-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-teal-100 rounded-lg flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm mb-1.5">
            AI-Generated
          </h3>
          <p className="text-gray-600 text-xs leading-relaxed">
            Seamlessly extends your image with AI-generated content that matches
            the original
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/50 p-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-lg flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 text-teal-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm mb-1.5">
            Perfect for Any Use
          </h3>
          <p className="text-gray-600 text-xs leading-relaxed">
            Great for social media, panoramas, and fixing cropped photos
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUncrop;
