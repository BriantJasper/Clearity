import { Sparkles, ChevronRight, Zap, Users, Download, Shield, Eye, Crop, SlidersHorizontal, Wand2, Upload, Check } from "lucide-react";
import { useState, useEffect } from "react";

export default function HeroSection() {
  // Feature Tour State
  const [currentStep, setCurrentStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Split Screen State (for future AI feature)
  const [showAfter, setShowAfter] = useState(false);

  const featureTourSteps = [
    { 
      area: { top: '5%', left: '0%', width: '19%', height: '95%' },
      title: "Layers Panel",
      desc: "Organize your work with layers and control opacity & blend modes",
      icon: <Crop className="w-5 h-5" />
    },
    { 
      area: { top: '0%', left: '0%', width: '100%', height: '6%' },
      title: "Top Toolbar",
      desc: "Quick access to essential tools, zoom controls, and export options",
      icon: <SlidersHorizontal className="w-5 h-5" />
    },
    { 
      area: { top: '5%', left: '81.5%', width: '18.5%', height: '95%' },
      title: "Tools Panel",
      desc: "Advanced editing features including crop, transform, adjust, and AI enhance",
      icon: <Wand2 className="w-5 h-5" />
    },
    { 
      area: { top: '6%', left: '19%', width: '62.5%', height: '94%' },
      title: "Canvas Workspace",
      desc: "Your creative canvas with real-time preview and non-destructive editing",
      icon: <Eye className="w-5 h-5" />
    },
  ];

  // Auto-advance feature tour - smooth and quick
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % featureTourSteps.length);
    }, 2500); // 2.5 seconds per step
    
    return () => clearInterval(interval);
  }, [isPaused, featureTourSteps.length]);

  return (
    <>
      <section
        id="home"
        className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-24 pb-24 bg-gradient-to-br from-slate-50 via-white to-cyan-50/40 relative overflow-hidden"
      >
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

        <div className="max-w-6xl mx-auto space-y-8 relative z-10">
          {/* Enhanced Badge */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-50 via-blue-50 to-purple-50 text-cyan-700 px-6 py-3 rounded-full text-sm font-semibold border border-cyan-200/50 hover:shadow-xl hover:shadow-cyan-200/50 transition-all hover:scale-105 cursor-pointer animate-fade-in backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 animate-pulse text-cyan-500" />
              <span>✨ AI-Powered</span>
            </div>
            <div className="w-px h-4 bg-cyan-300"></div>
            <span>Browser-based • No installation required</span>
          </div>

          {/* Enhanced Main Heading */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight animate-fade-in-up">
              Transform Your Images
            </h1>
            
            {/* Effortlessly as separate line */}
            <div className="text-4xl md:text-6xl font-bold animate-fade-in-up animation-delay-200">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-gradient">
                Effortlessly
              </span>
            </div>
          </div>

          {/* Enhanced Subtext with better structure */}
          <div className="max-w-4xl mx-auto space-y-4 animate-fade-in-up animation-delay-300">
            <p className="text-xl md:text-2xl text-gray-700 font-medium leading-relaxed">
              Professional editing tools at your fingertips
            </p>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Upload, edit, and enhance your photos with 
              <span className="text-cyan-600 font-semibold"> AI-powered tools</span> right from your browser — 
              <span className="text-purple-600 font-semibold"> no installation needed</span>
            </p>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-6 animate-fade-in-up animation-delay-400">
            <a
              href="/editor"
              className="group relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/50 flex items-center gap-3 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Sparkles className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                Start Editing Now
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          </div>

          {/* Enhanced Trust Indicators */}
          <div className="pt-8 flex flex-wrap justify-center items-center gap-8 text-sm animate-fade-in-up animation-delay-600">
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

          {/* INTERACTIVE PREVIEW SECTION */}
          <div className="pt-16 relative animate-fade-in-up animation-delay-800">
            {/* Preview Mode Selector */}
            <div className="flex justify-center gap-3 mb-6">
              <button
                onClick={() => setIsPaused(false)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  !isPaused 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <Eye className="w-5 h-5" />
                Feature Tour
              </button>
              <button
                onClick={() => setIsPaused(true)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  isPaused 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <Wand2 className="w-5 h-5" />
                AI Preview
              </button>
            </div>

            {/* FEATURE TOUR MODE */}
            {!isPaused && (
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50 bg-white p-6">
                <div className="relative">
                  {/* Editor Screenshot */}
                  <img
                    src="/images/preview-editors.png"
                    alt="Clearity Editor Interface"
                    className="w-full h-auto rounded-xl"
                  />
                  
                   {/* Dark overlay with smooth cutout animation */}
                   <div 
                     className="absolute inset-0 pointer-events-none z-20 rounded-xl"
                     style={{
                       backgroundColor: 'rgba(0, 0, 0, 0.67)',
                       clipPath: `polygon(
                         0 0, 
                         0 100%, 
                         ${featureTourSteps[currentStep].area.left} 100%, 
                         ${featureTourSteps[currentStep].area.left} ${featureTourSteps[currentStep].area.top},
                         calc(${featureTourSteps[currentStep].area.left} + ${featureTourSteps[currentStep].area.width}) ${featureTourSteps[currentStep].area.top},
                         calc(${featureTourSteps[currentStep].area.left} + ${featureTourSteps[currentStep].area.width}) calc(${featureTourSteps[currentStep].area.top} + ${featureTourSteps[currentStep].area.height}),
                         ${featureTourSteps[currentStep].area.left} calc(${featureTourSteps[currentStep].area.top} + ${featureTourSteps[currentStep].area.height}),
                         ${featureTourSteps[currentStep].area.left} 100%, 
                         100% 100%, 
                         100% 0
                       )`,
                       transition: 'clip-path 0.9s cubic-bezier(0.4, 0, 0.2, 1)'
                     }}
                  />
                  
                  {/* Highlighted Border Box - synchronized with overlay */}
                  <div 
                    className="absolute border-4 border-cyan-400 rounded-xl shadow-2xl shadow-cyan-400/60 pointer-events-none z-30 animate-pulse-border"
                    style={{
                      top: featureTourSteps[currentStep].area.top,
                      left: featureTourSteps[currentStep].area.left,
                      width: featureTourSteps[currentStep].area.width,
                      height: featureTourSteps[currentStep].area.height,
                      transition: 'all 0.9s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    {/* Corner accents - larger and more visible */}
                    <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-4 border-l-4 border-cyan-400 rounded-tl-xl"></div>
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-4 border-r-4 border-cyan-400 rounded-tr-xl"></div>
                    <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-4 border-l-4 border-cyan-400 rounded-bl-xl"></div>
                    <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-4 border-r-4 border-cyan-400 rounded-br-xl"></div>
                  </div>

                  {/* Feature Description Card - Bottom Center Inside Image */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl px-6 py-4 max-w-lg mx-4 animate-slide-up z-40">
                    <div className="text-center space-y-3">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-xs font-bold text-cyan-500 bg-cyan-50 px-3 py-1 rounded-full">
                          Step {currentStep + 1}/{featureTourSteps.length}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {featureTourSteps[currentStep].title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {featureTourSteps[currentStep].desc}
                      </p>
                    </div>

                    {/* Progress Dots */}
                    <div className="flex justify-center gap-2 mt-4 pt-4 border-t border-gray-100">
                      {featureTourSteps.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentStep(idx)}
                          className={`h-2 rounded-full transition-all ${
                            idx === currentStep 
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 w-8' 
                              : 'bg-gray-300 w-2 hover:bg-gray-400'
                          }`}
                          aria-label={`Go to step ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI SPLIT SCREEN MODE (Future Feature) */}
            {isPaused && (
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50 bg-white p-6">
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  {/* Toggle Controls */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-white/95 backdrop-blur-sm p-1.5 rounded-full shadow-xl border border-gray-200">
                    <button
                      onClick={() => setShowAfter(false)}
                      className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                        !showAfter 
                          ? 'bg-gray-900 text-white shadow-lg' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      Original
                    </button>
                    <button
                      onClick={() => setShowAfter(true)}
                      className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                        showAfter 
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      AI Enhanced
                    </button>
                  </div>

                  {/* Before Image */}
                  <div className={`absolute inset-0 transition-opacity duration-700 ${
                    showAfter ? 'opacity-0' : 'opacity-100'
                  }`}>
                    <img
                      src="/images/preview-editor.png"
                      alt="Original Editor"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-6 left-6 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                      Standard Editing
                    </div>
                  </div>

                  {/* After Image */}
                  <div className={`absolute inset-0 transition-opacity duration-700 ${
                    showAfter ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <img
                      src="/images/preview-editor-ai.png"
                      alt="AI Enhanced Editor"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-6 right-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg animate-bounce-slow">
                      <Sparkles className="w-4 h-4" />
                      AI Enhanced
                    </div>
                  </div>

                  {/* Enhancement Badge */}
                  {showAfter && (
                    <div className="absolute top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 animate-fade-in shadow-lg">
                      <Check className="w-4 h-4" />
                      Auto-Enhanced
                    </div>
                  )}
                </div>

                {/* Coming Soon Badge for AI */}
                <div className="mt-6 flex justify-center">
                  <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 px-6 py-3 rounded-full text-sm font-semibold">
                    <Wand2 className="w-4 h-4" />
                    <span>AI Features Coming Soon</span>
                  </div>
                </div>
              </div>
            )}

            {/* Floating accent elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-20 blur-3xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
            <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-3xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Font Import */}
      <link href="https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@600;700&display=swap" rel="stylesheet" />

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
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
          opacity: 0;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
          opacity: 0;
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

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        .animate-slide-down {
          animation: slideDown 0.5s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        .animate-slide-up {
          animation: slideUp 0.5s ease-out;
        }

        @keyframes pulseBorder {
          0%, 100% {
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(6, 182, 212, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(6, 182, 212, 0.7), 0 0 60px rgba(6, 182, 212, 0.4);
          }
        }

        .animate-pulse-border {
          animation: pulseBorder 2s ease-in-out infinite;
        }

        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-bounce-slow {
          animation: bounceSlow 2s ease-in-out infinite;
        }

        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </>
  );
}