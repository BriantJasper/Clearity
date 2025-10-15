import React, { useState, useRef } from "react";
import {
  Upload,
  Download,
  Type,
  Loader2,
  Sparkles,
  CheckCircle2,
  XCircle,
  Eraser,
} from "lucide-react";

const RemoveText = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      setProcessedImage(null);
      setOriginalImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveText = async () => {
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

      const apiResponse = await fetch("http://localhost:5000/api/remove-text", {
        method: "POST",
        body: formData,
      });

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        throw new Error(`Failed to remove text: ${errorText}`);
      }

      const resultBlob = await apiResponse.blob();
      const resultUrl = URL.createObjectURL(resultBlob);
      setProcessedImage(resultUrl);
    } catch (err) {
      console.error("Text removal error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to remove text. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;

    const link = document.createElement("a");
    link.download = `text-removed-${Date.now()}.png`;
    link.href = processedImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAll = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
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
            className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
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
                onClick={handleRemoveText}
                disabled={isProcessing}
                className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Eraser size={18} />
                    Remove Text
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

        {/* Info Banner */}
        {originalImage && !processedImage && !isProcessing && (
          <div className="mb-6 p-3 bg-red-50/80 backdrop-blur-sm border border-red-200/60 rounded-lg flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-900 font-medium text-xs">
                AI-Powered Text Detection
              </p>
              <p className="text-red-700 text-xs mt-1">
                Our AI will automatically detect and remove all text from your
                image
              </p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {processedImage && (
          <div className="mb-6 p-3 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/60 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-emerald-900 font-medium text-xs">
                Text Successfully Removed
              </p>
              <p className="text-emerald-700 text-xs mt-1">
                All text has been detected and removed from your image
              </p>
            </div>
          </div>
        )}

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
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Type size={32} className="text-red-600" />
            </div>
            <p className="text-gray-600 font-medium">No image uploaded yet</p>
            <p className="text-gray-400 text-sm mt-1 text-center max-w-md px-4">
              Upload an image with text, watermarks, or captions to remove them
              automatically
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original Image */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Original Image
                  </h3>
                  <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
                    With Text
                  </span>
                </div>
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
                    Text Removed
                  </h3>
                  {processedImage && (
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      Clean
                    </span>
                  )}
                </div>
                <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm">
                  {isProcessing ? (
                    <div className="flex flex-col items-center justify-center h-96">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-100 to-rose-100 flex items-center justify-center mb-4">
                        <Loader2
                          size={24}
                          className="text-red-600 animate-spin"
                        />
                      </div>
                      <p className="text-gray-700 font-medium">
                        Removing text...
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        AI is detecting and removing all text
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
                        <Eraser size={24} className="text-gray-300" />
                      </div>
                      <p className="text-gray-400">
                        Clean image will appear here
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
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/50 p-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-gradient-to-r from-red-100 to-rose-100 rounded-lg flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm mb-1.5">
            Automatic Detection
          </h3>
          <p className="text-gray-600 text-xs leading-relaxed">
            AI automatically finds and removes all text, no manual selection
            required
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/50 p-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-gradient-to-r from-rose-100 to-pink-100 rounded-lg flex items-center justify-center mb-3">
            <Type className="w-5 h-5 text-rose-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm mb-1.5">
            Any Language
          </h3>
          <p className="text-gray-600 text-xs leading-relaxed">
            Works with text in any language, including emojis and special
            characters
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/50 p-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-100 to-fuchsia-100 rounded-lg flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5 text-pink-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm mb-1.5">
            Clean Results
          </h3>
          <p className="text-gray-600 text-xs leading-relaxed">
            Get pristine images with text seamlessly removed and backgrounds
            filled
          </p>
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/50 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
          Perfect For:
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-xs font-semibold text-gray-800">
                Removing Watermarks
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                Clean up stock photos or images with unwanted watermarks
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-xs font-semibold text-gray-800">
                Social Media Posts
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                Remove captions and text overlays from images
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-xs font-semibold text-gray-800">
                Product Photos
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                Clean product images by removing price tags and labels
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-xs font-semibold text-gray-800">
                Screenshots & Memes
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                Remove text from screenshots and create clean templates
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveText;
