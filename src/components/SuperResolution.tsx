import React, { useState, useRef } from "react";
import {
  Upload,
  Download,
  ZoomIn,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
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
      // Fetch the original image as a blob
      const response = await fetch(originalImage);
      const blob = await response.blob();

      // Calculate target dimensions
      const targetWidth = Math.min(
        originalDimensions.width * scaleFactor,
        4096
      );
      const targetHeight = Math.min(
        originalDimensions.height * scaleFactor,
        4096
      );

      // Create FormData
      const formData = new FormData();
      formData.append("image", blob, "image.jpg");
      formData.append("target_width", targetWidth.toString());
      formData.append("target_height", targetHeight.toString());

      // Call backend API
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ZoomIn className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI Image Upscaler
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Enhance your images with Clipdrop AI - Upscale up to 4x with
            incredible detail
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Controls Section */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-gray-50 transition shadow-lg"
              >
                <Upload size={20} />
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
                <div className="flex items-center gap-4 bg-white rounded-xl px-4 py-2 shadow-lg">
                  <label className="text-gray-700 font-medium">Scale:</label>
                  <div className="flex gap-2">
                    {[2, 3, 4].map((factor) => (
                      <button
                        key={factor}
                        onClick={() => setScaleFactor(factor)}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                          scaleFactor === factor
                            ? "bg-indigo-600 text-white"
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
                <div className="flex gap-2">
                  <button
                    onClick={handleUpscale}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-50 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ZoomIn size={20} />
                        Upscale
                      </>
                    )}
                  </button>

                  {upscaledImage && (
                    <button
                      onClick={downloadImage}
                      className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition shadow-lg"
                    >
                      <Download size={20} />
                      Download
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Image Display Area */}
          <div className="p-6">
            {!originalImage ? (
              <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
                <ImageIcon size={64} className="text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg font-medium mb-2">
                  No image uploaded yet
                </p>
                <p className="text-gray-400 text-sm">
                  Click "Upload Image" to get started
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Original Image */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Original Image
                    </h3>
                    {originalDimensions && (
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {originalDimensions.width} × {originalDimensions.height}
                      </span>
                    )}
                  </div>
                  <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
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
                    <h3 className="text-lg font-semibold text-gray-800">
                      Upscaled Image
                    </h3>
                    {upscaledImage && originalDimensions && (
                      <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                        <CheckCircle2 size={14} />
                        {Math.min(
                          originalDimensions.width * scaleFactor,
                          4096
                        )}{" "}
                        ×{" "}
                        {Math.min(
                          originalDimensions.height * scaleFactor,
                          4096
                        )}
                      </span>
                    )}
                  </div>
                  <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                    {isProcessing ? (
                      <div className="flex flex-col items-center justify-center h-96">
                        <Loader2
                          size={48}
                          className="text-indigo-600 animate-spin mb-4"
                        />
                        <p className="text-gray-600 font-medium">
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
                        <ZoomIn size={48} className="text-gray-300 mb-4" />
                        <p className="text-gray-400">
                          Upscaled image will appear here
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reset Button */}
          {originalImage && (
            <div className="px-6 pb-6">
              <button
                onClick={resetAll}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
              >
                Reset & Start Over
              </button>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <ZoomIn className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Smart Upscaling
            </h3>
            <p className="text-gray-600 text-sm">
              AI-powered upscaling up to 4x with enhanced detail preservation
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">High Quality</h3>
            <p className="text-gray-600 text-sm">
              Maintain image quality while increasing resolution up to 4096px
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
              <Loader2 className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Fast Processing
            </h3>
            <p className="text-gray-600 text-sm">
              Quick upscaling powered by Clipdrop's advanced AI technology
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpscaler;
