import {
  Crop,
  RotateCw,
  FlipHorizontal2,
  SlidersHorizontal,
  Contrast,
  Sun,
  Sparkles,
  MoveUpRight,
  Layers,
  Paintbrush,
  Zap,
  Eye,
  Scissors,
  Palette,
  Wand2,
  Maximize2,
  Camera,
  Image as ImageIcon,
  Type,
  Expand,
  Eraser,
  Film,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative pt-32 pb-24 bg-gradient-to-br from-gray-50 via-white to-cyan-50/30 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-600 px-4 py-2 rounded-full text-sm font-medium border border-cyan-100 mb-6">
            <Zap className="w-4 h-4 animate-pulse" />
            <span>Powerful Features</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            All The Tools You{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
              Need
            </span>
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Professional-grade image editing tools, AI-powered features, and
            seamless workflow — all in your browser
          </p>
        </div>

        {/* Core Editing Tools */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Core Editing Tools
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              {
                icon: Crop,
                label: "Crop & Resize",
                color: "from-green-400 to-emerald-500",
              },
              {
                icon: RotateCw,
                label: "Rotate",
                color: "from-blue-400 to-cyan-500",
              },
              {
                icon: FlipHorizontal2,
                label: "Flip",
                color: "from-purple-400 to-violet-500",
              },
              {
                icon: Contrast,
                label: "Contrast",
                color: "from-orange-400 to-red-500",
              },
              {
                icon: Sun,
                label: "Brightness",
                color: "from-yellow-400 to-orange-500",
              },
              {
                icon: SlidersHorizontal,
                label: "Filters",
                color: "from-pink-400 to-rose-500",
              },
            ].map(({ icon: IconComp, label, color }, index) => (
              <div
                key={label}
                className="group flex flex-col items-center gap-4 p-6 rounded-2xl border border-gray-200/50 bg-white/70 backdrop-blur-sm hover:bg-white hover:shadow-xl hover:-translate-y-2 hover:border-cyan-300 transition-all duration-300 cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComp className="w-8 h-8 text-white" />
                </div>
                <span className="text-gray-700 font-semibold text-center group-hover:text-gray-900 transition-colors">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Features - UPDATED ICONS */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            AI-Powered Features
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              {
                icon: Scissors,
                label: "Remove Background",
                description: "Remove backgrounds instantly with AI",
                color: "from-cyan-400 to-blue-500",
                badge: "Popular",
              },
              {
                icon: Palette,
                label: "Style Transfer",
                description: "Transform images with artistic styles",
                color: "from-purple-400 to-pink-500",
                badge: "New",
              },
              {
                icon: Wand2,
                label: "Object Removal",
                description: "Remove unwanted objects seamlessly",
                color: "from-blue-400 to-indigo-500",
              },
              {
                icon: Maximize2,
                label: "Super Resolution",
                description: "Enhance image quality with AI upscaling",
                color: "from-pink-400 to-rose-500",
              },
              {
                icon: Camera,
                label: "Product Photography",
                description: "Professional product shots with AI",
                color: "from-amber-400 to-orange-500",
              },
              {
                icon: ImageIcon,
                label: "Replace Background",
                description: "Change backgrounds with AI precision",
                color: "from-cyan-400 to-sky-500",
              },
              {
                icon: Type,
                label: "Text to Image",
                description: "Generate images from text descriptions",
                color: "from-violet-400 to-purple-500",
              },
              {
                icon: Expand,
                label: "Image Uncrop",
                description: "Extend images beyond original boundaries",
                color: "from-emerald-400 to-green-500",
              },
            ].map(({ icon: IconComp, label, description, color, badge }, index) => (
              <div
                key={label}
                className="group p-6 rounded-2xl border border-gray-200/50 bg-white/70 backdrop-blur-sm hover:bg-white hover:shadow-xl hover:-translate-y-2 hover:border-cyan-300 transition-all duration-300 cursor-pointer animate-fade-in-up relative"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                {badge && (
                  <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-semibold ${
                    badge === "Popular" 
                      ? "bg-gradient-to-r from-orange-400 to-red-500 text-white" 
                      : "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                  }`}>
                    {badge}
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                  >
                    <IconComp className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 font-semibold mb-2 group-hover:text-gray-700 transition-colors">
                      {label}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Last Row - Centered for 2 items */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-3xl mx-auto mt-6">
            {[
              {
                icon: Eraser,
                label: "Remove Text",
                description: "Remove text overlays from images",
                color: "from-red-400 to-rose-500",
              },
              {
                icon: Film,
                label: "Video Generation",
                description: "Create videos from images and prompts",
                color: "from-rose-400 to-pink-500",
              },
            ].map(({ icon: IconComp, label, description, color }, index) => (
              <div
                key={label}
                className="group p-6 rounded-2xl border border-gray-200/50 bg-white/70 backdrop-blur-sm hover:bg-white hover:shadow-xl hover:-translate-y-2 hover:border-cyan-300 transition-all duration-300 cursor-pointer animate-fade-in-up relative"
                style={{ animationDelay: `${1.4 + index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                  >
                    <IconComp className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 font-semibold mb-2 group-hover:text-gray-700 transition-colors">
                      {label}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Tools */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Advanced Tools
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Layers,
                label: "Layer Management",
                description: "Work with multiple layers for complex edits",
              },
              {
                icon: Paintbrush,
                label: "Brush Tools",
                description: "Paint and draw with precision brushes",
              },
              {
                icon: Eye,
                label: "Preview Modes",
                description: "Compare before and after with split view",
              },
            ].map(({ icon: IconComp, label, description }, index) => (
              <div
                key={label}
                className="group p-8 rounded-2xl border border-gray-200/50 bg-white/70 backdrop-blur-sm hover:bg-white hover:shadow-xl hover:-translate-y-2 hover:border-cyan-300 transition-all duration-300 cursor-pointer animate-fade-in-up text-center"
                style={{ animationDelay: `${1.0 + index * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mx-auto mb-4">
                  <IconComp className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-gray-900 font-semibold mb-3 group-hover:text-gray-700 transition-colors">
                  {label}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <Link to="/editor">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/50 cursor-pointer animate-fade-in-up animation-delay-600">
              <Sparkles className="w-6 h-6" />
              Start Editing Now
              <MoveUpRight className="w-5 h-5" />
            </div>
          </div>
        </Link>
      </div>

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

        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </section>
  );
}