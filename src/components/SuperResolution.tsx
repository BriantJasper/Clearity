import { useState, useCallback } from "react";
import axios from "axios";
import { Upload, Download, Sparkles, Maximize2, CheckCircle, AlertCircle, Loader2, Zap, Settings } from "lucide-react";

export default function SuperResolution() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [scale, setScale] = useState("2");
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    } else {
      setError("Please upload a valid image file (JPG, PNG, WebP formats)");
    }
  };

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const enhance = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("scale", scale);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/super-resolution",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "blob",
        }
      );

      const url = URL.createObjectURL(response.data);
      setResult(url);
    } catch (err) {
      console.error(err);
      setError("Enhancement failed. Please try again or check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Your Image</h3>
            <p className="text-gray-600">Upload an image to enhance its resolution with AI upscaling</p>
          </div>

          {/* Enhanced Upload Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
              dragActive
                ? "border-pink-400 bg-pink-50/50 scale-105"
                : preview
                ? "border-green-300 bg-green-50/30"
                : "border-gray-300 hover:border-pink-400 hover:bg-pink-50/30"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
              id="upload-input"
            />
            <label htmlFor="upload-input" className="cursor-pointer block">
              <div className="flex flex-col items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                  dragActive 
                    ? "bg-pink-100 scale-110" 
                    : preview 
                    ? "bg-green-100" 
                    : "bg-gray-100 group-hover:bg-pink-100"
                }`}>
                  <Upload className={`w-8 h-8 transition-colors ${
                    dragActive 
                      ? "text-pink-600" 
                      : preview 
                      ? "text-green-600" 
                      : "text-gray-400 group-hover:text-pink-600"
                  }`} />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-1">
                    {preview ? "Image Uploaded!" : "Drag & Drop or Click to Upload"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {preview ? "Click to change image" : "Supports JPG, PNG, WebP formats"}
                  </p>
                </div>
              </div>
            </label>

            {dragActive && (
              <div className="absolute inset-0 bg-pink-100/50 rounded-2xl border-2 border-pink-400 flex items-center justify-center">
                <div className="text-pink-600 font-semibold">Drop your image here</div>
              </div>
            )}
          </div>

          {/* Scale Selection */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-5 h-5 text-gray-600" />
              <h4 className="font-semibold text-gray-900">Enhancement Settings</h4>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upscaling Factor
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setScale("2")}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      scale === "2"
                        ? "border-pink-400 bg-pink-50 text-pink-700"
                        : "border-gray-200 hover:border-pink-300 text-gray-600"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold">2×</div>
                      <div className="text-xs">Double Resolution</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setScale("4")}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      scale === "4"
                        ? "border-pink-400 bg-pink-50 text-pink-700"
                        : "border-gray-200 hover:border-pink-300 text-gray-600"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold">4×</div>
                      <div className="text-xs">Quadruple Resolution</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Image Preview */}
          {preview && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h4 className="font-semibold text-gray-900">Original Image</h4>
              </div>
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-auto rounded-xl shadow-lg"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-gray-600">
                  {image?.name}
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Process Button */}
          <button
            onClick={enhance}
            disabled={loading || !image}
            className={`w-full group relative bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-pink-400/50 flex items-center justify-center gap-3 ${
              loading || !image
                ? "opacity-50 cursor-not-allowed scale-100"
                : ""
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Enhancing with AI...</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Enhance Resolution</span>
                <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Enhanced Result</h3>
            <p className="text-gray-600">Your image with enhanced resolution and quality</p>
          </div>

          {result ? (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h4 className="font-semibold text-gray-900">Resolution Enhanced</h4>
                <span className="ml-auto bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs font-medium">
                  {scale}× Upscaled
                </span>
              </div>
              <div className="relative mb-4">
                <img
                  src={result}
                  alt="Result"
                  className="w-full h-auto rounded-xl shadow-lg"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-gray-600">
                  Enhanced Quality
                </div>
              </div>
              <a
                href={result}
                download="enhanced-image.png"
                className="w-full group bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-3"
              >
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                <span>Download Enhanced Image</span>
              </a>
            </div>
          ) : (
            <div className="bg-gray-50/50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="font-semibold text-gray-600 mb-2">Ready for AI Enhancement</h4>
              <p className="text-gray-500 text-sm">
                Upload an image to see the AI-powered super resolution result here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Features Info */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50">
          <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-pink-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">AI-Powered</h4>
          <p className="text-gray-600 text-sm">Advanced neural networks for superior image enhancement</p>
        </div>
        <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Maximize2 className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">High Resolution</h4>
          <p className="text-gray-600 text-sm">Upscale images up to 4× with preserved quality and detail</p>
        </div>
        <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Download className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Instant Download</h4>
          <p className="text-gray-600 text-sm">Get your enhanced image immediately, no waiting</p>
        </div>
      </div>
    </div>
  );
}
