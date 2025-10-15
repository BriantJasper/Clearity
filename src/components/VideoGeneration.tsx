import { useState } from "react";
import {
  Video,
  Download,
  Play,
  Pause,
  Loader2,
  Film,
  Clock,
} from "lucide-react";

interface VideoGenerationProps {
  apiUrl?: string;
}

interface GeneratedVideo {
  url: string;
  prompt: string;
  aspectRatio: string;
  timestamp: number;
  duration?: number;
}

const EXAMPLE_PROMPTS = [
  "A serene time-lapse of clouds moving over a mountain range at sunset",
  "A cute puppy playing with a ball in a sunny garden",
  "Ocean waves crashing against rocky cliffs in slow motion",
  "A busy city street with cars and people during golden hour",
  "Northern lights dancing across a starry night sky",
  "A hummingbird hovering near colorful flowers in a garden",
  "Rain drops falling on a window with blurred city lights in the background",
  "A campfire crackling under a starry night sky",
  "Hot air balloons floating over a misty valley at sunrise",
  "A waterfall cascading into a crystal clear pool surrounded by tropical plants",
];

const ASPECT_RATIOS = [
  { value: "16:9", label: "16:9 (Landscape)", icon: "🖥️" },
  { value: "9:16", label: "9:16 (Portrait)", icon: "📱" },
  { value: "1:1", label: "1:1 (Square)", icon: "⬜" },
];

const STYLE_SUGGESTIONS = [
  "cinematic",
  "slow motion",
  "time-lapse",
  "aerial view",
  "close-up",
  "wide angle",
  "sunset lighting",
  "dramatic",
  "peaceful",
  "vibrant colors",
];

export default function VideoGeneration({
  apiUrl = "http://localhost:5000",
}: VideoGenerationProps) {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<number>(0);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError(null);
    setEstimatedTime(60); // Estimated 60 seconds

    // Countdown timer
    const timer = setInterval(() => {
      setEstimatedTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    try {
      const response = await fetch(`${apiUrl}/api/generate-video`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          aspectRatio,
        }),
      });

      clearInterval(timer);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate video");
      }

      const blob = await response.blob();
      const videoUrl = URL.createObjectURL(blob);

      // Get video duration
      const video = document.createElement("video");
      video.src = videoUrl;
      video.onloadedmetadata = () => {
        const newVideo: GeneratedVideo = {
          url: videoUrl,
          prompt: prompt.trim(),
          aspectRatio,
          timestamp: Date.now(),
          duration: video.duration,
        };

        setGeneratedVideos((prev) => [newVideo, ...prev]);
      };
    } catch (err) {
      clearInterval(timer);
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error:", err);
    } finally {
      setLoading(false);
      setEstimatedTime(0);
    }
  };

  const handleDownload = (videoUrl: string, index: number) => {
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = `generated-video-${index + 1}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const togglePlay = (index: number) => {
    const video = document.getElementById(`video-${index}`) as HTMLVideoElement;
    if (video) {
      if (playingVideo === index) {
        video.pause();
        setPlayingVideo(null);
      } else {
        video.play();
        setPlayingVideo(index);
      }
    }
  };

  const addStyleSuggestion = (style: string) => {
    if (prompt.trim()) {
      setPrompt(`${prompt}, ${style}`);
    } else {
      setPrompt(style);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Film className="w-12 h-12 text-indigo-600" />
            <h1 className="text-5xl font-bold text-gray-800">
              AI Video Generator
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Create stunning videos from text using Gemini Veo3
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {/* Prompt Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Describe Your Video Scene
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  handleGenerate();
                }
              }}
              placeholder="A majestic eagle soaring over snow-capped mountains during golden hour..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none resize-none text-gray-700"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Press Ctrl + Enter to generate | Video generation may take 30-90
              seconds
            </p>
          </div>

          {/* Aspect Ratio Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-3 gap-3">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.value}
                  onClick={() => setAspectRatio(ratio.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    aspectRatio === ratio.value
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <div className="text-2xl mb-1">{ratio.icon}</div>
                  <div className="font-semibold text-sm">{ratio.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Style Suggestions */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Style Suggestions
            </label>
            <div className="flex flex-wrap gap-2">
              {STYLE_SUGGESTIONS.map((style) => (
                <button
                  key={style}
                  onClick={() => addStyleSuggestion(style)}
                  className="px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-sm hover:from-indigo-200 hover:to-purple-200 transition-all"
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
                  onClick={() => setPrompt(example)}
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

          {/* Loading Progress */}
          {loading && (
            <div className="mb-6 p-6 bg-indigo-50 border border-indigo-200 rounded-lg">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                <span className="text-indigo-700 font-semibold">
                  Generating your video...
                </span>
              </div>
              <div className="w-full bg-indigo-200 rounded-full h-2 mb-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.max(5, 100 - (estimatedTime / 60) * 100)}%`,
                  }}
                />
              </div>
              <div className="text-center text-sm text-indigo-600">
                <Clock className="w-4 h-4 inline mr-1" />
                Estimated time remaining: ~{estimatedTime}s
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-4 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Video...
              </>
            ) : (
              <>
                <Film className="w-5 h-5" />
                Generate Video
              </>
            )}
          </button>
        </div>

        {/* Generated Videos Gallery */}
        {generatedVideos.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Video className="w-6 h-6" />
              Generated Videos ({generatedVideos.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedVideos.map((video, index) => (
                <div
                  key={video.timestamp}
                  className="group relative bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                >
                  {/* Video Player */}
                  <div className="relative aspect-video bg-black">
                    <video
                      id={`video-${index}`}
                      src={video.url}
                      className="w-full h-full object-contain"
                      loop
                      onEnded={() => setPlayingVideo(null)}
                    />

                    {/* Play/Pause Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => togglePlay(index)}
                        className="bg-white bg-opacity-80 text-gray-800 p-4 rounded-full hover:bg-opacity-100 transition-all"
                      >
                        {playingVideo === index ? (
                          <Pause className="w-8 h-8" />
                        ) : (
                          <Play className="w-8 h-8" />
                        )}
                      </button>
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownload(video.url, index)}
                      className="absolute top-3 right-3 bg-white bg-opacity-80 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition-all"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </button>

                    {/* Aspect Ratio Badge */}
                    <div className="absolute top-3 left-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs font-semibold">
                      {video.aspectRatio}
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-4">
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {video.prompt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{new Date(video.timestamp).toLocaleString()}</span>
                      {video.duration && (
                        <span>{formatTime(Math.floor(video.duration))}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {generatedVideos.length === 0 && !loading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Video className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No videos generated yet
            </h3>
            <p className="text-gray-500">
              Enter a prompt above and click "Generate Video" to create your
              first AI video
            </p>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-3">
            🎬 Tips for Better Video Results:
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>
              • Be specific about camera movements (pan, zoom, tracking shot)
            </li>
            <li>
              • Describe lighting conditions (golden hour, dramatic shadows)
            </li>
            <li>• Include motion details (slow motion, time-lapse, speed)</li>
            <li>
              • Mention atmosphere and mood (peaceful, dramatic, energetic)
            </li>
            <li>• Specify subjects clearly and their actions</li>
            <li>• Video generation typically takes 30-90 seconds</li>
            <li>• Use style suggestions to enhance your prompt</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
