import React, { useState, useRef } from "react";
import {
  Upload,
  Download,
  ZoomIn,
  Loader2,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";

const ImageUpscaler = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [upscaledImage, setUpscaledImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scaleFactor, setScaleFactor] = useState(2);
  const [originalDimensions, setOriginalDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      setUpscaledImage(null);

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setOriginalDimensions({
            width: img.width,
            height: img.height,
          });
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
      setOriginalImage(URL.createObjectURL(file));
    }
  };

  const handleUpscale = async () => {
    if (!originalImage || !originalDimensions) {
      setError("Please upload an image first!");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch(originalImage);
      const blob = await response.blob();

      const targetWidth = Math.min(
        originalDimensions.width * scaleFactor,
        4096
      );
      const targetHeight = Math.min(
        originalDimensions.height * scaleFactor,
        4096
      );

      const formData = new FormData();
      formData.append("image", blob, "image.jpg");
      formData.append("target_width", targetWidth.toString());
      formData.append("target_height", targetHeight.toString());

      const apiResponse = await fetch(
        "http://localhost:5000/api/upscale-image",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        throw new Error(`Failed to upscale image: ${errorText}`);
      }

      const resultBlob = await apiResponse.blob();
      const resultUrl = URL.createObjectURL(resultBlob);
      setUpscaledImage(resultUrl);
    } catch (err) {
      console.error("Upscaling error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to upscale image. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!upscaledImage) return;

    const link = document.createElement("a");
    link.download = `upscaled-${scaleFactor}x-${Date.now()}.jpg`;
    link.href = upscaledImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAll = () => {
    setOriginalImage(null);
    setUpscaledImage(null);
    setOriginalDimensions(null);
    setError(null);
    setScaleFactor(2);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      {/* Controls Section */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
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

          {/* Scale Factor Selector */}
          {originalImage && (
            <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
              <label className="text-sm font-semibold text-gray-700">
                Scale:
              </label>
              <div className="flex gap-2">
                {[2, 3, 4].map((factor) => (
                  <button
                    key={factor}
                    onClick={() => setScaleFactor(factor)}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                      scaleFactor === factor
                        ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {factor}x
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {originalImage && (
            <div className="flex gap-2 ml-auto">
              <button
                onClick={handleUpscale}
                disabled={isProcessing}
                className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-600 to-rose-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ZoomIn size={18} />
                    Upscale
                  </>
                )}
              </button>

              {upscaledImage && (
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

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50/80 backdrop-blur-sm border border-red-200/60 rounded-lg flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Image Display Area */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200/50 shadow-lg overflow-hidden mb-8">
        {!originalImage ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ZoomIn size={32} className="text-pink-600" />
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
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Original
                  </h3>
                  {originalDimensions && (
                    <span className="text-xs font-medium text-gray-500 bg-white/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-gray-200">
                      {originalDimensions.width} × {originalDimensions.height}
                    </span>
                  )}
                </div>
                <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm">
                  <img
                    src={originalImage}
                    alt="Original"
                    className="w-full h-auto object-contain max-h-96"
                  />
                </div>
              </div>

              {/* Upscaled Image */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Upscaled
                  </h3>
                  {upscaledImage && originalDimensions && (
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      {Math.min(
                        originalDimensions.width * scaleFactor,
                        4096
                      )} ×{" "}
                      {Math.min(originalDimensions.height * scaleFactor, 4096)}
                    </span>
                  )}
                </div>
                <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm">
                  {isProcessing ? (
                    <div className="flex flex-col items-center justify-center h-96">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 flex items-center justify-center mb-4">
                        <Loader2
                          size={24}
                          className="text-pink-600 animate-spin"
                        />
                      </div>
                      <p className="text-gray-700 font-medium">
                        Upscaling your image...
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        This may take a few seconds
                      </p>
                    </div>
                  ) : upscaledImage ? (
                    <img
                      src={upscaledImage}
                      alt="Upscaled"
                      className="w-full h-auto object-contain max-h-96"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-96">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <ZoomIn size={24} className="text-gray-300" />
                      </div>
                      <p className="text-gray-400">
                        Upscaled image will appear here
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
          <div className="w-10 h-10 bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg flex items-center justify-center mb-3">
            <ZoomIn className="w-5 h-5 text-pink-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm mb-1.5">
            Smart Upscaling
          </h3>
          <p className="text-gray-600 text-xs leading-relaxed">
            AI-powered upscaling up to 4x with enhanced detail preservation
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/50 p-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm mb-1.5">
            High Quality
          </h3>
          <p className="text-gray-600 text-xs leading-relaxed">
            Maintain image quality while increasing resolution up to 4096px
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/50 p-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm mb-1.5">
            Fast Processing
          </h3>
          <p className="text-gray-600 text-xs leading-relaxed">
            Quick upscaling powered by Clipdrop's advanced AI technology
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUpscaler;
