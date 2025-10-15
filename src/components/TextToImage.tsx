import { useState } from "react";
import {
  Sparkles,
  Download,
  RefreshCw,
  Copy,
  Loader2,
  XCircle,
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
    <div className="w-full">
      {/* Prompt Input Section */}
      <div className="mb-8 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm p-6">
        <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
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
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200 resize-none text-gray-700 bg-white/50 transition-all"
          rows={4}
        />
        <p className="text-xs text-gray-500 mt-2">
          Press Ctrl + Enter to generate • Be specific and descriptive for best
          results
        </p>
      </div>

      {/* Style Modifiers */}
      <div className="mb-8 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm p-6">
        <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Add Style Modifier
        </label>
        <div className="flex flex-wrap gap-2">
          {STYLE_MODIFIERS.map((style) => (
            <button
              key={style}
              onClick={() => addStyleModifier(style)}
              className="px-3 py-1.5 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 rounded-lg text-xs font-medium hover:from-violet-200 hover:to-purple-200 transition-all border border-violet-200/50"
            >
              + {style}
            </button>
          ))}
        </div>
      </div>

      {/* Example Prompts */}
      <div className="mb-8 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm p-6">
        <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Example Prompts
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {EXAMPLE_PROMPTS.map((example) => (
            <button
              key={example}
              onClick={() => handleUseExample(example)}
              className="text-left px-3 py-2.5 bg-gray-50/80 text-gray-700 rounded-lg text-xs hover:bg-gray-100 transition-all border border-gray-200 hover:border-violet-300 hover:shadow-sm"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-3 bg-red-50/80 backdrop-blur-sm border border-red-200/60 rounded-lg flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Generate Button */}
      <div className="mb-8">
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Image...
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
        <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-600" />
            Generated Images ({generatedImages.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedImages.map((image, index) => (
              <div
                key={image.timestamp}
                className="group relative bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-200"
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
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleDownload(image.url, index)}
                    className="bg-white/90 text-gray-800 p-2.5 rounded-full hover:bg-white transition-all shadow-md"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPrompt(image.prompt)}
                    className="bg-white/90 text-gray-800 p-2.5 rounded-full hover:bg-white transition-all shadow-md"
                    title="Regenerate"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Prompt */}
                <div className="p-3 bg-white/50 backdrop-blur-sm">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs text-gray-600 line-clamp-2 flex-1">
                      {image.prompt}
                    </p>
                    <button
                      onClick={() => handleCopyPrompt(image.prompt)}
                      className="text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0"
                      title="Copy prompt"
                    >
                      <Copy className="w-3.5 h-3.5" />
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
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200/50 shadow-lg p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-violet-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No images generated yet
          </h3>
          <p className="text-gray-500 text-sm">
            Enter a prompt above and click "Generate Image" to get started
          </p>
        </div>
      )}

      {/* Tips Section */}
      <div className="mt-8 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-200/50 p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
            ?
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Tips for better results:
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex gap-2">
                <span className="font-semibold text-violet-600 min-w-max">
                  •
                </span>
                <span>Be specific and descriptive in your prompts</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-violet-600 min-w-max">
                  •
                </span>
                <span>
                  Include details about lighting, mood, and composition
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-violet-600 min-w-max">
                  •
                </span>
                <span>
                  Use style modifiers to achieve desired artistic effects
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-violet-600 min-w-max">
                  •
                </span>
                <span>
                  Mention colors, textures, and atmosphere for richer results
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-violet-600 min-w-max">
                  •
                </span>
                <span>Experiment with different variations of your prompt</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
