import React, { useState, useRef } from "react";
import {
  Upload,
  Download,
  Camera,
  Loader2,
  Sparkles,
  Sun,
  Moon,
  RefreshCw,
  Palette,
} from "lucide-react";

const ProductPhotography = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Advanced settings
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [lightTheta, setLightTheta] = useState(20); // 0-45
  const [lightPhi, setLightPhi] = useState(0); // 0-359
  const [lightSize, setLightSize] = useState(1.7); // 1.0-8.0
  const [shadowDarkness, setShadowDarkness] = useState(0.7); // 0.5-2.0
  const [showAdvanced, setShowAdvanced] = useState(false);

  const presetColors = [
    { name: "White", color: "#ffffff" },
    { name: "Light Gray", color: "#f5f5f5" },
    { name: "Beige", color: "#f5f5dc" },
    { name: "Light Blue", color: "#e6f2ff" },
    { name: "Light Pink", color: "#ffe6f0" },
    { name: "Light Green", color: "#e6ffe6" },
    { name: "Lavender", color: "#f0e6ff" },
    { name: "Peach", color: "#ffe6d9" },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      setProcessedImage(null);
      setOriginalImage(URL.createObjectURL(file));
    }
  };

  const handleProcess = async () => {
    if (!originalImage) {
      setError("Please upload an image first!");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Fetch the original image as a blob
      const response = await fetch(originalImage);
      const blob = await response.blob();

      // Create FormData
      const formData = new FormData();
      formData.append("image", blob, "image.jpg");
      formData.append("background_color", backgroundColor); // Keep the # symbol
      formData.append("light_theta", lightTheta.toString());
      formData.append("light_phi", lightPhi.toString());
      formData.append("light_size", lightSize.toString());
      formData.append("shadow_darkness", shadowDarkness.toString());

      // Call backend API
      const apiResponse = await fetch(
        "http://localhost:5000/api/product-photography",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        throw new Error(`Failed to process image: ${errorText}`);
      }

      const resultBlob = await apiResponse.blob();
      const resultUrl = URL.createObjectURL(resultBlob);
      setProcessedImage(resultUrl);
    } catch (err) {
      console.error("Processing error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to process image. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;

    const link = document.createElement("a");
    link.download = `product-photo-${Date.now()}.jpg`;
    link.href = processedImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAll = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
    setBackgroundColor("#ffffff");
    setLightTheta(20);
    setLightPhi(0);
    setLightSize(1.7);
    setShadowDarkness(0.7);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Camera className="w-10 h-10 text-orange-600" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
              AI Product Photography
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Transform any product photo into professional studio-quality images
            with AI
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Controls Section */}
          <div className="bg-gradient-to-r from-orange-500 to-rose-600 p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-gray-50 transition shadow-lg"
              >
                <Upload size={20} />
                {originalImage ? "Change Image" : "Upload Product"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Action Buttons */}
              {originalImage && (
                <div className="flex gap-2">
                  <button
                    onClick={handleProcess}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-rose-600 rounded-xl font-semibold hover:bg-gray-50 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        Generate Studio Photo
                      </>
                    )}
                  </button>

                  {processedImage && (
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

          {/* Settings Panel */}
          {originalImage && (
            <div className="p-6 bg-gradient-to-r from-orange-50 to-rose-50 border-b">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Palette size={20} />
                  Studio Settings
                </h3>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  {showAdvanced ? "Hide" : "Show"} Advanced
                </button>
              </div>

              {/* Background Color Presets */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Background Color
                </label>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                  {presetColors.map((preset) => (
                    <button
                      key={preset.color}
                      onClick={() => setBackgroundColor(preset.color)}
                      className={`h-12 rounded-lg border-2 transition-all ${
                        backgroundColor === preset.color
                          ? "border-orange-500 ring-2 ring-orange-200 scale-105"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: preset.color }}
                      title={preset.name}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-mono text-sm"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              {/* Advanced Settings */}
              {showAdvanced && (
                <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-orange-200">
                  {/* Light Angle (Theta) */}
                  <div>
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <Sun size={16} />
                        Light Angle (Vertical)
                      </span>
                      <span className="text-orange-600 font-semibold">
                        {lightTheta}°
                      </span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="45"
                      value={lightTheta}
                      onChange={(e) => setLightTheta(Number(e.target.value))}
                      className="w-full h-2 bg-gradient-to-r from-yellow-200 to-orange-400 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      0° = top, 45° = diagonal (longer shadow)
                    </p>
                  </div>

                  {/* Light Position (Phi) */}
                  <div>
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <RefreshCw size={16} />
                        Light Position (Around)
                      </span>
                      <span className="text-orange-600 font-semibold">
                        {lightPhi}°
                      </span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="359"
                      value={lightPhi}
                      onChange={(e) => setLightPhi(Number(e.target.value))}
                      className="w-full h-2 bg-gradient-to-r from-blue-200 to-purple-400 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      0° = right, 90° = front, 180° = left
                    </p>
                  </div>

                  {/* Light Size */}
                  <div>
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <Sun size={16} />
                        Light Size (Shadow Softness)
                      </span>
                      <span className="text-orange-600 font-semibold">
                        {lightSize.toFixed(1)}
                      </span>
                    </label>
                    <input
                      type="range"
                      min="1.0"
                      max="8.0"
                      step="0.1"
                      value={lightSize}
                      onChange={(e) => setLightSize(Number(e.target.value))}
                      className="w-full h-2 bg-gradient-to-r from-yellow-300 to-orange-500 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Lower = sharp shadow, Higher = diffuse shadow
                    </p>
                  </div>

                  {/* Shadow Darkness */}
                  <div>
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <Moon size={16} />
                        Shadow Darkness
                      </span>
                      <span className="text-orange-600 font-semibold">
                        {shadowDarkness.toFixed(1)}
                      </span>
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={shadowDarkness}
                      onChange={(e) =>
                        setShadowDarkness(Number(e.target.value))
                      }
                      className="w-full h-2 bg-gradient-to-r from-gray-300 to-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Lower = lighter shadow, Higher = darker shadow
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Image Display Area */}
          <div className="p-6">
            {!originalImage ? (
              <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
                <Camera size={64} className="text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg font-medium mb-2">
                  No product image uploaded yet
                </p>
                <p className="text-gray-400 text-sm">
                  Click "Upload Product" to get started
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Original Image */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Original Product
                  </h3>
                  <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                    <img
                      src={originalImage}
                      alt="Original"
                      className="w-full h-auto object-contain"
                      style={{ maxHeight: "500px" }}
                    />
                  </div>
                </div>

                {/* Processed Image */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Studio Quality Photo
                    </h3>
                    {processedImage && (
                      <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                        <Sparkles size={14} />
                        1024×1024
                      </span>
                    )}
                  </div>
                  <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                    {isProcessing ? (
                      <div className="flex flex-col items-center justify-center h-96">
                        <Loader2
                          size={48}
                          className="text-orange-600 animate-spin mb-4"
                        />
                        <p className="text-gray-600 font-medium">
                          Creating studio photo...
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                          Adding perfect lighting and shadows
                        </p>
                      </div>
                    ) : processedImage ? (
                      <img
                        src={processedImage}
                        alt="Processed"
                        className="w-full h-auto object-contain"
                        style={{ maxHeight: "500px" }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-96">
                        <Sparkles size={48} className="text-gray-300 mb-4" />
                        <p className="text-gray-400">
                          Studio photo will appear here
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
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <Camera className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Professional Studio
            </h3>
            <p className="text-gray-600 text-sm">
              Transform any photo into studio-quality product images with
              perfect centering
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4">
              <Sun className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Advanced Lighting
            </h3>
            <p className="text-gray-600 text-sm">
              Control light angle, position, and shadow to match your brand
              aesthetic
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Consistent Results
            </h3>
            <p className="text-gray-600 text-sm">
              All products get the same dimensions and professional look for
              your store
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPhotography;
