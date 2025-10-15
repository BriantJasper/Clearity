import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Wand2,
  Scissors,
  Palette,
  Maximize2,
  Sparkles,
  Zap,
  ArrowLeft,
  Star,
  Users,
  Shield,
  Download,
  Camera,
  Eraser,
  Expand,
  Image as ImageIcon,
  Type,
  Film,
} from "lucide-react";
import RemoveBackground from "../components/RemoveBackground";
import StyleTransferRei from "../components/StyleTransferRei";
import ObjectRemoval from "../components/ObjectRemoval";
import SuperResolution from "../components/SuperResolution";
import ProductPhotography from "../components/ProductPhotography";
import ReplaceBackground from "../components/ReplaceBackgroundProps";
import TextToImage from "../components/TextToImage";
import VideoGeneration from "../components/VideoGeneration";
import ImageUncrop from "../components/ImageUncrop";
import RemoveText from "../components/RemoveText";

type TabKey =
  | "remove-background"
  | "style-transfer"
  | "object-removal"
  | "super-resolution"
  | "productphotography"
  | "replace-background"
  | "text-to-image"
  | "image-uncrop"
  | "remove-text"
  | "video-generation";

const tabs: {
  key: TabKey;
  label: string;
  icon: JSX.Element;
  color: string;
  gradient: string;
  badge?: string;
}[] = [
  {
    key: "remove-background",
    label: "Remove Background",
    icon: <Scissors className="w-5 h-5" />,
    color: "cyan",
    gradient: "from-cyan-400 to-blue-500",
    badge: "Popular",
  },
  {
    key: "style-transfer",
    label: "Style Transfer",
    icon: <Palette className="w-5 h-5" />,
    color: "purple",
    gradient: "from-purple-400 to-pink-500",
    badge: "New",
  },
  {
    key: "object-removal",
    label: "Object Removal",
    icon: <Wand2 className="w-5 h-5" />,
    color: "blue",
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    key: "super-resolution",
    label: "Super Resolution",
    icon: <Maximize2 className="w-5 h-5" />,
    color: "pink",
    gradient: "from-pink-400 to-rose-500",
  },
  {
    key: "productphotography",
    label: "Product Photography",
    icon: <Camera className="w-5 h-5" />,
    color: "amber",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    key: "replace-background",
    label: "Replace Background",
    icon: <ImageIcon className="w-5 h-5" />,
    color: "cyan",
    gradient: "from-cyan-400 to-sky-500",
  },
  {
    key: "text-to-image",
    label: "Text to Image",
    icon: <Type className="w-5 h-5" />,
    color: "violet",
    gradient: "from-violet-400 to-purple-500",
  },
  {
    key: "image-uncrop",
    label: "Image Uncrop",
    icon: <Expand className="w-5 h-5" />,
    color: "emerald",
    gradient: "from-emerald-400 to-green-500",
  },
  {
    key: "remove-text",
    label: "Remove Text",
    icon: <Eraser className="w-5 h-5" />,
    color: "red",
    gradient: "from-red-400 to-rose-500",
  },

  {
    key: "video-generation",
    label: "Video Generation",
    icon: <Film className="w-5 h-5" />,
    color: "rose",
    gradient: "from-rose-400 to-pink-500",
  },
];

export default function AIFeaturesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = (searchParams.get("tab") as TabKey) || "remove-background";

  const CurrentPanel = useMemo(() => {
    switch (selected) {
      case "remove-background":
        return <RemoveBackground />;
      case "style-transfer":
        return <StyleTransferRei />;
      case "object-removal":
        return <ObjectRemoval />;
      case "super-resolution":
        return <SuperResolution />;
      case "productphotography":
        return <ProductPhotography />;
      case "replace-background":
        return <ReplaceBackground />;
      case "text-to-image":
        return <TextToImage />;
      case "remove-text":
        return <RemoveText />;
      case "image-uncrop":
        return <ImageUncrop />;
      case "video-generation":
        return <VideoGeneration />;
      default:
        return <RemoveBackground />;
    }
  }, [selected]);

  const handleSelect = (key: TabKey) => {
    setSearchParams({ tab: key });
  };

  const currentTab = tabs.find((t) => t.key === selected);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/40 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main blobs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000"></div>

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-float opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-float animation-delay-1000 opacity-60"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-float animation-delay-2000 opacity-60"></div>
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-float animation-delay-3000 opacity-60"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 hover:text-cyan-600 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <div className="h-4 w-px bg-gray-300"></div>
            <div className="flex items-center gap-2 text-cyan-600">
              <Sparkles className="w-5 h-5" />
              <h1 className="text-xl font-semibold">AI Features</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Transform Your Images with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-gradient">
              AI Magic
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Professional AI-powered image editing tools that work right in your
            browser. No downloads, no sign-ups, just powerful results.
          </p>
        </div>

        {/* Enhanced Tabs Navigation */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-3">
            <div className="flex flex-wrap justify-center gap-3">
              {tabs.map((tab, index) => {
                const isActive = selected === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => handleSelect(tab.key)}
                    className={`group relative flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 animate-fade-in-up ${
                      isActive
                        ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg shadow-${tab.color}-200/50 scale-105`
                        : "text-gray-600 hover:bg-white/80 hover:text-gray-900 hover:shadow-md hover:scale-105"
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-white/20"
                          : `bg-${tab.color}-50 group-hover:bg-${tab.color}-100`
                      }`}
                    >
                      <span
                        className={
                          isActive ? "text-white" : `text-${tab.color}-600`
                        }
                      >
                        {tab.icon}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{tab.label}</span>
                      {tab.badge && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            tab.badge === "Popular"
                              ? "bg-cyan-100 text-cyan-600"
                              : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Current Feature Header */}
        {currentTab && (
          <div className="mb-8 animate-fade-in-up animation-delay-200">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
              <div className="flex items-center justify-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${currentTab.gradient} flex items-center justify-center shadow-lg`}
                >
                  <span className="text-white">{currentTab.icon}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {currentTab.label}
                  </h3>
                </div>
                {currentTab.badge && (
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                      currentTab.badge === "Popular"
                        ? "bg-cyan-100 text-cyan-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    <Star className="w-3 h-3" />
                    {currentTab.badge}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden animate-fade-in-up animation-delay-300">
          <div className="p-8">{CurrentPanel}</div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm animate-fade-in-up animation-delay-400">
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-green-200/50 hover:bg-white hover:shadow-md transition-all">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium">100% Free</span>
          </div>
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200/50 hover:bg-white hover:shadow-md transition-all">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="text-blue-700 font-medium">No Sign-up</span>
          </div>
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200/50 hover:bg-white hover:shadow-md transition-all">
            <Users className="w-4 h-4 text-purple-500" />
            <span className="text-purple-700 font-medium">Privacy First</span>
          </div>
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-cyan-200/50 hover:bg-white hover:shadow-md transition-all">
            <Download className="w-4 h-4 text-cyan-500" />
            <span className="text-cyan-700 font-medium">Instant Download</span>
          </div>
        </div>
      </div>

      {/* Enhanced Styles */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }

        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        /* Dynamic color utilities */
        .bg-cyan-50 { background-color: rgb(236 254 255); }
        .bg-purple-50 { background-color: rgb(250 245 255); }
        .bg-blue-50 { background-color: rgb(239 246 255); }
        .bg-pink-50 { background-color: rgb(253 242 248); }
        .bg-cyan-100 { background-color: rgb(207 250 254); }
        .bg-purple-100 { background-color: rgb(243 232 255); }
        .bg-blue-100 { background-color: rgb(219 234 254); }
        .bg-pink-100 { background-color: rgb(252 231 243); }
        .text-cyan-600 { color: rgb(8 145 178); }
        .text-purple-600 { color: rgb(147 51 234); }
        .text-blue-600 { color: rgb(37 99 235); }
        .text-pink-600 { color: rgb(219 39 119); }
        .text-cyan-700 { color: rgb(14 116 144); }
        .text-purple-700 { color: rgb(126 34 206); }
        .text-blue-700 { color: rgb(29 78 216); }
        .text-pink-700 { color: rgb(190 24 93); }
        .border-cyan-200 { border-color: rgb(165 243 252); }
        .border-purple-200 { border-color: rgb(221 214 254); }
        .border-blue-200 { border-color: rgb(191 219 254); }
        .border-pink-200 { border-color: rgb(251 207 232); }
        .shadow-cyan-200 { box-shadow: 0 10px 15px -3px rgb(165 243 252 / 0.1), 0 4px 6px -2px rgb(165 243 252 / 0.05); }
        .shadow-purple-200 { box-shadow: 0 10px 15px -3px rgb(221 214 254 / 0.1), 0 4px 6px -2px rgb(221 214 254 / 0.05); }
        .shadow-blue-200 { box-shadow: 0 10px 15px -3px rgb(191 219 254 / 0.1), 0 4px 6px -2px rgb(191 219 254 / 0.05); }
        .shadow-pink-200 { box-shadow: 0 10px 15px -3px rgb(251 207 232 / 0.1), 0 4px 6px -2px rgb(251 207 232 / 0.05); }
      `}</style>
    </div>
  );
}
