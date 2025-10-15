import { useState, useRef } from "react";
import { Upload, Wand2, Download, X, Loader2, XCircle } from "lucide-react";

interface ReplaceBackgroundProps {
  apiUrl?: string;
}

const PRESET_PROMPTS = [
  "professional studio background",
  "outdoor nature scene",
  "modern office interior",
  "minimalist white background",
  "colorful abstract background",
  "sunset beach scene",
  "city skyline at night",
  "cozy living room",
  "futuristic tech environment",
  "tropical paradise",
];

export default function ReplaceBackground({
  apiUrl = "http://localhost:5000",
}: ReplaceBackgroundProps) {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("professional studio background");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target?.result as string);
        setProcessedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReplaceBackground = async () => {
    if (!originalImage) {
      setError("Please upload an image first");
      return;
    }

    if (!prompt.trim()) {
      setError("Please enter a background description");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(originalImage);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("image", blob, "image.png");
      formData.append("prompt", prompt);

      const result = await fetch(`${apiUrl}/api/replace-background`, {
        method: "POST",
        body: formData,
      });

      if (!result.ok) {
        const errorText = await result.text();
        throw new Error(errorText || "Failed to replace background");
      }

      const imageBlob = await result.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setProcessedImage(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;

    const link = document.createElement("a");
    link.href = processedImage;
    link.download = "background-replaced.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
    setPrompt("professional studio background");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      {/* Upload Section */}
      {!originalImage ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center cursor-pointer hover:border-cyan-400 hover:bg-cyan-50/30 transition-all shadow-lg mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload size={32} className="text-cyan-600" />
          </div>
          <p className="text-lg font-semibold text-gray-800 mb-2">
            Upload an Image
          </p>
          <p className="text-gray-500 text-sm">
            Click to browse or drag and drop your image here
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      ) : (
        <>
          {/* Controls Section */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <Upload size={18} className="group-hover:animate-bounce" />
                Change Image
              </button>

              <button
                onClick={handleReplaceBackground}
                disabled={loading}
                className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Wand2 size={18} />
                    Replace Background
                  </>
                )}
              </button>

              {processedImage && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all"
                >
                  <Download size={18} />
                  Download
                </button>
              )}

              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/70 backdrop-blur-sm text-gray-700 rounded-lg font-medium border border-gray-200 hover:bg-white hover:shadow-md transition-all ml-auto"
              >
                <X size={18} />
                Reset
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-50/80 backdrop-blur-sm border border-red-200/60 rounded-lg flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Image Comparison */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200/50 shadow-lg overflow-hidden mb-8 p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Original Image
                </h3>
                <div className="relative rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm aspect-square">
                  <img
                    src={originalImage}
                    alt="Original"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  New Background
                </h3>
                <div className="relative rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm aspect-square">
                  {processedImage ? (
                    <img
                      src={processedImage}
                      alt="Processed"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                        <Wand2 size={24} className="text-gray-300" />
                      </div>
                      <p className="text-sm">Processing will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Prompt Input */}
          <div className="mb-8 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm p-5">
            <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Background Description
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the background you want..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200 resize-none bg-white/50 transition-all"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-2">
              Be descriptive for best results (e.g., "sunny beach with palm
              trees and clear blue sky")
            </p>
          </div>

          {/* Preset Prompts */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm p-5">
            <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Quick Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_PROMPTS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setPrompt(preset)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    prompt === preset
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Info Section */}
      {!originalImage && (
        <div className="mt-8 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200/50 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
              ?
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Tips for best results:
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex gap-2">
                  <span className="font-semibold text-cyan-600 min-w-max">
                    •
                  </span>
                  <span>Use clear, descriptive prompts for best results</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-cyan-600 min-w-max">
                    •
                  </span>
                  <span>Images with clear subject separation work best</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-cyan-600 min-w-max">
                    •
                  </span>
                  <span>
                    Try different presets or create your own descriptions
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-cyan-600 min-w-max">
                    •
                  </span>
                  <span>
                    The AI automatically detects and preserves your subject
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
