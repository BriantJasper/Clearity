import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Wand2,
  Scissors,
  Palette,
  Maximize2,
  Layers,
  Image as ImageIcon,
} from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);

  const aiFeatures = [
    {
      icon: <Scissors className="w-5 h-5" />,
      title: "Remove Background",
      description: "AI-powered background removal",
      path: "/remove-bg",
      color: "cyan",
      badge: "Popular",
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: "Style Transfer",
      description: "Transform images with artistic styles",
      path: "/art",
      color: "purple",
      badge: "New",
    },
    {
      icon: <Wand2 className="w-5 h-5" />,
      title: "Object Removal",
      description: "Remove unwanted objects seamlessly",
      path: "/objectremoval",
      color: "blue",
    },
    {
      icon: <Maximize2 className="w-5 h-5" />,
      title: "Super Resolution",
      description: "Upscale images with AI enhancement",
      path: "/super-resolution",
      color: "pink",
    },
  ];

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-xl shadow-sm fixed top-0 left-0 w-full z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <img
              src="/images/logo-whitetheme.png"
              alt="Clearity"
              className="h-8 md:h-9 w-auto select-none pointer-events-none"
              loading="eager"
              decoding="async"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 font-medium">
            <Link
              to="/"
              className="relative text-gray-700 hover:text-cyan-400 transition-colors group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* AI Features Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setAiMenuOpen(true)}
              onMouseLeave={() => setAiMenuOpen(false)}
            >
              <button className="relative text-gray-700 hover:text-cyan-400 transition-colors group flex items-center gap-1">
                <Wand2 className="w-4 h-4" />
                AI Features
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    aiMenuOpen ? "rotate-180" : ""
                  }`}
                />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 ${
                  aiMenuOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                {/* Dropdown Header */}
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-cyan-600">
                    <Sparkles className="w-5 h-5" />
                    <h3 className="font-semibold text-sm">AI-Powered Tools</h3>
                  </div>
                </div>

                {/* Dropdown Items */}
                <div className="py-2">
                  {aiFeatures.map((feature, index) => (
                    <Link
                      key={index}
                      to={feature.path}
                      className="group flex items-start gap-4 px-6 py-4 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all"
                    >
                      {/* Icon */}
                      <div
                        className={`w-12 h-12 rounded-xl bg-${feature.color}-50 flex items-center justify-center text-${feature.color}-500 group-hover:scale-110 group-hover:shadow-md transition-all flex-shrink-0`}
                      >
                        {feature.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm group-hover:text-cyan-600 transition-colors">
                            {feature.title}
                          </h4>
                          {feature.badge && (
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                feature.badge === "Popular"
                                  ? "bg-cyan-100 text-cyan-600"
                                  : "bg-purple-100 text-purple-600"
                              }`}
                            >
                              {feature.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>

                      {/* Arrow */}
                      <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90 group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>

                {/* Dropdown Footer */}
                <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                  <Link
                    to="/ai"
                    className="flex items-center justify-between text-sm font-semibold text-cyan-600 hover:text-cyan-700 transition-colors"
                  >
                    <span>View all AI features</span>
                    <ChevronDown className="w-4 h-4 -rotate-90" />
                  </Link>
                </div>
              </div>
            </div>

            <Link
              to="/about"
              className="relative text-gray-700 hover:text-cyan-400 transition-colors group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* CTA Button */}
            <Link
              to="/editor"
              className="group relative bg-gradient-to-r from-cyan-400 to-cyan-500 text-white px-5 py-2 rounded-lg font-semibold overflow-hidden transition-all hover:shadow-lg hover:shadow-cyan-200 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                Try Now
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-700 hover:text-cyan-400 transition-colors p-2 hover:bg-cyan-50 rounded-lg"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden bg-white border-t overflow-hidden transition-all duration-300 ${
            open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <Link
            to="/"
            className="block px-6 py-3 hover:bg-cyan-50 hover:text-cyan-500 transition-all border-l-4 border-transparent hover:border-cyan-400"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>

          {/* Mobile AI Features Accordion */}
          <div className="border-l-4 border-transparent">
            <button
              onClick={() => setAiMenuOpen(!aiMenuOpen)}
              className="w-full flex items-center justify-between px-6 py-3 hover:bg-cyan-50 hover:text-cyan-500 transition-all text-left"
            >
              <span className="flex items-center gap-2">
                <Wand2 className="w-4 h-4" />
                AI Features
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  aiMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Mobile AI Submenu */}
            <div
              className={`bg-gray-50 overflow-hidden transition-all duration-300 ${
                aiMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {aiFeatures.map((feature, index) => (
                <Link
                  key={index}
                  to={feature.path}
                  className="flex items-center gap-3 px-10 py-3 hover:bg-cyan-50 transition-all"
                  onClick={() => setOpen(false)}
                >
                  <div
                    className={`w-8 h-8 rounded-lg bg-${feature.color}-50 flex items-center justify-center text-${feature.color}-500 flex-shrink-0`}
                  >
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {feature.title}
                      </span>
                      {feature.badge && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-600">
                          {feature.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <Link
            to="/about"
            className="block px-6 py-3 hover:bg-cyan-50 hover:text-cyan-500 transition-all border-l-4 border-transparent hover:border-cyan-400"
            onClick={() => setOpen(false)}
          >
            About
          </Link>
          <Link
            to="/editor"
            className="block mx-6 my-3 text-center bg-gradient-to-r from-cyan-400 to-cyan-500 text-white px-5 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
            onClick={() => setOpen(false)}
          >
            Try Now
          </Link>
        </div>
      </nav>

      <style>{`
        /* Custom color classes for dynamic colors */
        .bg-cyan-50 { background-color: rgb(236 254 255); }
        .bg-purple-50 { background-color: rgb(250 245 255); }
        .bg-blue-50 { background-color: rgb(239 246 255); }
        .bg-pink-50 { background-color: rgb(253 242 248); }
        
        .text-cyan-500 { color: rgb(6 182 212); }
        .text-purple-500 { color: rgb(168 85 247); }
        .text-blue-500 { color: rgb(59 130 246); }
        .text-pink-500 { color: rgb(236 72 153); }
      `}</style>
    </>
  );
}
