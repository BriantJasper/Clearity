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
  XCircle,
} from "lucide-react";

const ProductPhotography = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Advanced settings
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [lightTheta, setLightTheta] = useState(20);
  const [lightPhi, setLightPhi] = useState(0);
  const [lightSize, setLightSize] = useState(1.7);
  const [shadowDarkness, setShadowDarkness] = useState(0.7);
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
      const response = await fetch(originalImage);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("image", blob, "image.jpg");
      formData.append("background_color", backgroundColor);
      formData.append("light_theta", lightTheta.toString());
      formData.append("light_phi", lightPhi.toString());
      formData.append("light_size", lightSize.toString());
      formData.append("shadow_darkness", shadowDarkness.toString());

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
    <div className="w-full">
      {/* Controls Section */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Upload size={18} className="group-hover:animate-bounce" />
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
            <div className="flex gap-2 ml-auto">
              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generate Studio Photo
                  </>
                )}
              </button>

              {processedImage && (
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

      {/* Settings Panel */}
      {originalImage && (
        <div className="mb-8 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
              <Palette size={16} className="text-amber-600" />
              Studio Settings
            </h3>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-amber-600 hover:text-amber-700 font-semibold px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 transition-all"
            >
              {showAdvanced ? "Hide" : "Show"} Advanced
            </button>
          </div>

          {/* Background Color Presets */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Background Color
            </label>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-4">
              {presetColors.map((preset) => (
                <button
                  key={preset.color}
                  onClick={() => setBackgroundColor(preset.color)}
                  className={`h-10 rounded-lg border-2 transition-all ${
                    backgroundColor === preset.color
                      ? "border-amber-500 ring-2 ring-amber-200 scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={{ backgroundColor: preset.color }}
                  title={preset.name}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg font-mono text-sm bg-white/50"
                placeholder="#ffffff"
              />
            </div>
          </div>

          {/* Advanced Settings */}
          {showAdvanced && (
            <div className="grid md:grid-cols-2 gap-4 pt-5 border-t border-gray-200">
              {/* Light Angle (Theta) */}
              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  <span className="flex items-center gap-2">
                    <Sun size={14} className="text-amber-600" />
                    Light Angle (Vertical)
                  </span>
                  <span className="text-amber-600">{lightTheta}°</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="45"
                  value={lightTheta}
                  onChange={(e) => setLightTheta(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-yellow-200 to-orange-400 rounded-full appearance-none cursor-pointer accent-amber-600"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  0° = top, 45° = diagonal (longer shadow)
                </p>
              </div>

              {/* Light Position (Phi) */}
              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  <span className="flex items-center gap-2">
                    <RefreshCw size={14} className="text-amber-600" />
                    Light Position (Around)
                  </span>
                  <span className="text-amber-600">{lightPhi}°</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="359"
                  value={lightPhi}
                  onChange={(e) => setLightPhi(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-blue-200 to-purple-400 rounded-full appearance-none cursor-pointer accent-amber-600"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  0° = right, 90° = front, 180° = left
                </p>
              </div>

              {/* Light Size */}
              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  <span className="flex items-center gap-2">
                    <Sun size={14} className="text-amber-600" />
                    Light Size (Shadow Softness)
                  </span>
                  <span className="text-amber-600">{lightSize.toFixed(1)}</span>
                </label>
                <input
                  type="range"
                  min="1.0"
                  max="8.0"
                  step="0.1"
                  value={lightSize}
                  onChange={(e) => setLightSize(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-yellow-300 to-orange-500 rounded-full appearance-none cursor-pointer accent-amber-600"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Lower = sharp shadow, Higher = diffuse shadow
                </p>
              </div>

              {/* Shadow Darkness */}
              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  <span className="flex items-center gap-2">
                    <Moon size={14} className="text-amber-600" />
                    Shadow Darkness
                  </span>
                  <span className="text-amber-600">
                    {shadowDarkness.toFixed(1)}
                  </span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={shadowDarkness}
                  onChange={(e) => setShadowDarkness(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-gray-300 to-gray-800 rounded-full appearance-none cursor-pointer accent-amber-600"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Lower = lighter shadow, Higher = darker shadow
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Image Display Area */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200/50 shadow-lg overflow-hidden mb-8">
        {!originalImage ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera size={32} className="text-amber-600" />
            </div>
            <p className="text-gray-600 font-medium">
              No product image uploaded yet
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Click "Upload Product" to get started
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original Image */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Original Product
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

              {/* Processed Image */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Studio Quality Photo
                  </h3>
                  {processedImage && (
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Sparkles size={12} />
                      1024×1024
                    </span>
                  )}
                </div>
                <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm">
                  {isProcessing ? (
                    <div className="flex flex-col items-center justify-center h-96">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center mb-4">
                        <Loader2
                          size={24}
                          className="text-amber-600 animate-spin"
                        />
                      </div>
                      <p className="text-gray-700 font-medium">
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
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <Sparkles size={24} className="text-gray-300" />
                      </div>
                      <p className="text-gray-400">
                        Studio photo will appear here
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
          <div className="w-10 h-10 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg flex items-center justify-center mb-3">
            <Camera className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm mb-1.5">
            Professional Studio
          </h3>
          <p className="text-gray-600 text-xs leading-relaxed">
            Transform any photo into studio-quality product images with perfect
            centering
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/50 p-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-100 to-rose-100 rounded-lg flex items-center justify-center mb-3">
            <Sun className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm mb-1.5">
            Advanced Lighting
          </h3>
          <p className="text-gray-600 text-xs leading-relaxed">
            Control light angle, position, and shadow to match your brand
            aesthetic
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/50 p-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-lg flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 text-yellow-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm mb-1.5">
            Consistent Results
          </h3>
          <p className="text-gray-600 text-xs leading-relaxed">
            All products get the same dimensions and professional look for your
            store
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductPhotography;
