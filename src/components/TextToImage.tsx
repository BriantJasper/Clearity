import { useState } from "react";
import {
  Sparkles,
  Download,
  RefreshCw,
  Copy,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

interface TextToImageProps {
  apiUrl?: string;
}

interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

const EXAMPLE_PROMPTS = [
  "A serene mountain landscape at sunset with purple skies",
  "A futuristic city with flying cars and neon lights",
  "A cute robot reading a book in a cozy library",
  "An astronaut riding a horse on the moon",
  "A magical forest with glowing mushrooms and fireflies",
  "A steampunk airship floating above Victorian London",
  "A cozy coffee shop on a rainy evening",
  "A majestic dragon perched on a castle tower",
  "An underwater city with coral buildings and fish",
  "A cyberpunk street market at night with neon signs",
];

const STYLE_MODIFIERS = [
  "photorealistic",
  "oil painting",
  "watercolor",
  "digital art",
  "anime style",
  "3D render",
  "sketch",
  "cinematic",
  "minimalist",
  "fantasy art",
];

export default function TextToImage({
  apiUrl = "http://localhost:5000",
}: TextToImageProps) {
  const [prompt, setPrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/api/text-to-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image");
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      const newImage: GeneratedImage = {
        url: imageUrl,
        prompt: prompt.trim(),
        timestamp: Date.now(),
      };

      setGeneratedImages((prev) => [newImage, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (imageUrl: string, index: number) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `generated-image-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleUseExample = (example: string) => {
    setPrompt(example);
  };

  const addStyleModifier = (style: string) => {
    if (prompt.trim()) {
      setPrompt(`${prompt}, ${style}`);
    } else {
      setPrompt(style);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sparkles className="w-10 h-10 text-purple-600" />
            <h1 className="text-5xl font-bold text-gray-800">Text to Image</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Transform your words into stunning AI-generated images
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {/* Prompt Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Describe Your Image
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  handleGenerate();
                }
              }}
              placeholder="A beautiful sunset over a calm ocean with dolphins jumping..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none text-gray-700"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Press Ctrl + Enter to generate
            </p>
          </div>

          {/* Style Modifiers */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Add Style
            </label>
            <div className="flex flex-wrap gap-2">
              {STYLE_MODIFIERS.map((style) => (
                <button
                  key={style}
                  onClick={() => addStyleModifier(style)}
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm hover:from-purple-200 hover:to-pink-200 transition-all"
                >
                  + {style}
                </button>
              ))}
            </div>
          </div>

          {/* Example Prompts */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Example Prompts
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {EXAMPLE_PROMPTS.map((example) => (
                <button
                  key={example}
                  onClick={() => handleUseExample(example)}
                  className="text-left px-3 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm hover:bg-gray-100 transition-all border border-gray-200"
                >
                  {example}
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

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Your Image...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Image
              </>
            )}
          </button>
        </div>

        {/* Generated Images Gallery */}
        {generatedImages.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <ImageIcon className="w-6 h-6" />
              Generated Images ({generatedImages.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedImages.map((image, index) => (
                <div
                  key={image.timestamp}
                  className="group relative bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                >
                  {/* Image */}
                  <div className="aspect-square bg-gray-200">
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => handleDownload(image.url, index)}
                      className="bg-white text-gray-800 p-3 rounded-full hover:bg-gray-100 transition-all"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setPrompt(image.prompt)}
                      className="bg-white text-gray-800 p-3 rounded-full hover:bg-gray-100 transition-all"
                      title="Regenerate"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Prompt */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-gray-600 line-clamp-2 flex-1">
                        {image.prompt}
                      </p>
                      <button
                        onClick={() => handleCopyPrompt(image.prompt)}
                        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                        title="Copy prompt"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(image.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {generatedImages.length === 0 && !loading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No images generated yet
            </h3>
            <p className="text-gray-500">
              Enter a prompt above and click "Generate Image" to get started
            </p>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-3">
            💡 Tips for Better Results:
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Be specific and descriptive in your prompts</li>
            <li>• Include details about lighting, mood, and composition</li>
            <li>• Use style modifiers to achieve desired artistic effects</li>
            <li>
              • Mention colors, textures, and atmosphere for richer results
            </li>
            <li>• Experiment with different variations of your prompt</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
