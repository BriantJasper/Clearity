import { useState } from "react";
import {
  Video,
  Download,
  Play,
  Pause,
  Loader2,
  Film,
  Clock,
  XCircle,
} from "lucide-react";

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

const VideoGeneration = ({ apiUrl = "http://localhost:5000" }) => {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [generatedVideos, setGeneratedVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(0);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError(null);
    setEstimatedTime(60);

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

      const video = document.createElement("video");
      video.src = videoUrl;
      video.onloadedmetadata = () => {
        const newVideo = {
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

  const handleDownload = (videoUrl, index) => {
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = `generated-video-${index + 1}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const togglePlay = (index) => {
    const video = document.getElementById(`video-${index}`);
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

  const addStyleSuggestion = (style) => {
    if (prompt.trim()) {
      setPrompt(`${prompt}, ${style}`);
    } else {
      setPrompt(style);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full">
      {/* Prompt Input Section */}
      <div className="mb-8 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm p-6">
        <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
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
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200 resize-none text-gray-700 bg-white/50 transition-all"
          rows={4}
        />
        <p className="text-xs text-gray-500 mt-2">
          Press Ctrl + Enter to generate • Video generation may take 30-90
          seconds
        </p>
      </div>

      {/* Aspect Ratio Selection */}
      <div className="mb-8 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm p-6">
        <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Aspect Ratio
        </label>
        <div className="grid grid-cols-3 gap-3">
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio.value}
              onClick={() => setAspectRatio(ratio.value)}
              className={`p-3 rounded-lg border-2 transition-all text-sm ${
                aspectRatio === ratio.value
                  ? "border-rose-500 bg-rose-50 text-rose-700"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"
              }`}
            >
              <div className="text-lg mb-1">{ratio.icon}</div>
              <div className="font-semibold text-xs">{ratio.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Style Suggestions */}
      <div className="mb-8 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm p-6">
        <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Style Suggestions
        </label>
        <div className="flex flex-wrap gap-2">
          {STYLE_SUGGESTIONS.map((style) => (
            <button
              key={style}
              onClick={() => addStyleSuggestion(style)}
              className="px-3 py-1.5 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 rounded-lg text-xs font-medium hover:from-rose-200 hover:to-pink-200 transition-all border border-rose-200/50"
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
              onClick={() => setPrompt(example)}
              className="text-left px-3 py-2.5 bg-gray-50/80 text-gray-700 rounded-lg text-xs hover:bg-gray-100 transition-all border border-gray-200 hover:border-rose-300 hover:shadow-sm"
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

      {/* Loading Progress */}
      {loading && (
        <div className="mb-8 p-4 bg-rose-50/80 backdrop-blur-sm border border-rose-200/60 rounded-lg">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Loader2 className="w-5 h-5 animate-spin text-rose-600" />
            <span className="text-rose-700 font-medium text-sm">
              Generating your video...
            </span>
          </div>
          <div className="w-full bg-rose-200 rounded-full h-2 mb-2">
            <div
              className="bg-rose-600 h-2 rounded-full transition-all duration-1000"
              style={{
                width: `${Math.max(5, 100 - (estimatedTime / 60) * 100)}%`,
              }}
            />
          </div>
          <div className="text-center text-xs text-rose-600">
            <Clock className="w-3 h-3 inline mr-1" />
            Estimated time remaining: ~{estimatedTime}s
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="mb-8">
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all flex items-center justify-center gap-2"
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
        <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Video className="w-5 h-5 text-rose-600" />
            Generated Videos ({generatedVideos.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedVideos.map((video, index) => (
              <div
                key={video.timestamp}
                className="group relative bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-200"
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
                      className="bg-white/90 text-gray-800 p-3 rounded-full hover:bg-white transition-all shadow-md"
                    >
                      {playingVideo === index ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                    </button>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(video.url, index)}
                    className="absolute top-2 right-2 bg-white/90 text-gray-800 p-2 rounded-full hover:bg-white transition-all shadow-md"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {/* Aspect Ratio Badge */}
                  <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-semibold">
                    {video.aspectRatio}
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-3 bg-white/50 backdrop-blur-sm">
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
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
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200/50 shadow-lg p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-rose-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No videos generated yet
          </h3>
          <p className="text-gray-500 text-sm">
            Enter a prompt above and click "Generate Video" to create your first
            AI video
          </p>
        </div>
      )}

      {/* Tips Section */}
      <div className="mt-8 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-200/50 p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
            ?
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Tips for better video results:
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex gap-2">
                <span className="font-semibold text-rose-600 min-w-max">•</span>
                <span>
                  Be specific about camera movements (pan, zoom, tracking shot)
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-rose-600 min-w-max">•</span>
                <span>
                  Describe lighting conditions (golden hour, dramatic shadows)
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-rose-600 min-w-max">•</span>
                <span>
                  Include motion details (slow motion, time-lapse, speed)
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-rose-600 min-w-max">•</span>
                <span>
                  Mention atmosphere and mood (peaceful, dramatic, energetic)
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-rose-600 min-w-max">•</span>
                <span>Specify subjects clearly and their actions</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-rose-600 min-w-max">•</span>
                <span>Video generation typically takes 30-90 seconds</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoGeneration;
