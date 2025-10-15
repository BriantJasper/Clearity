import { useState, useRef } from "react";
import { Upload, Wand2, Download, X, Loader2 } from "lucide-react";

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
      // Convert base64 to blob
      const response = await fetch(originalImage);
      const blob = await response.blob();

      // Create form data
      const formData = new FormData();
      formData.append("image", blob, "image.png");
      formData.append("prompt", prompt);

      // Send to backend
      const result = await fetch(`${apiUrl}/api/replace-background`, {
        method: "POST",
        body: formData,
      });

      if (!result.ok) {
        const errorText = await result.text();
        throw new Error(errorText || "Failed to replace background");
      }

      // Convert response to base64
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Replace Background
          </h1>
          <p className="text-gray-600">
            Transform your images with AI-powered background replacement
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* Upload Section */}
          {!originalImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-4 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all"
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl font-semibold text-gray-700 mb-2">
                Upload an Image
              </p>
              <p className="text-gray-500">
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
              {/* Image Comparison */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">
                    Original Image
                  </h3>
                  <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-square">
                    <img
                      src={originalImage}
                      alt="Original"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">
                    New Background
                  </h3>
                  <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-square">
                    {processedImage ? (
                      <img
                        src={processedImage}
                        alt="Processed"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Wand2 className="w-16 h-16" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Prompt Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Background Description
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the background you want..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                  rows={3}
                />
              </div>

              {/* Preset Prompts */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quick Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_PROMPTS.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setPrompt(preset)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        prompt === preset
                          ? "bg-purple-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleReplaceBackground}
                  disabled={loading}
                  className="flex-1 min-w-[200px] bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Replace Background
                    </>
                  )}
                </button>

                {processedImage && (
                  <button
                    onClick={handleDownload}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                )}

                <button
                  onClick={handleReset}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all flex items-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Reset
                </button>
              </div>
            </>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-2">Tips:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Use clear, descriptive prompts for best results</li>
            <li>• Images with clear subject separation work best</li>
            <li>• Try different preset backgrounds or create your own</li>
            <li>
              • The AI will automatically detect and preserve your subject
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
