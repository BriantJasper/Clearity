import { Sparkles, ChevronRight, Zap, Play, Star, Users, Download, Shield } from "lucide-react";

export default function HeroSection() {
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

        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
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
            
            <a
              href="#features"
              className="group bg-white/80 backdrop-blur-sm text-gray-700 px-10 py-5 rounded-2xl font-semibold text-lg transition-all border-2 border-gray-200/50 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-100/50 hover:-translate-y-1 flex items-center gap-3"
            >
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Watch Demo
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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

          {/* Enhanced Hero Visual / Screenshot Preview */}
          <div className="pt-16 relative group animate-fade-in-up animation-delay-800">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50 bg-gradient-to-br from-white via-gray-50 to-cyan-50/30 p-12 transition-all duration-500 group-hover:shadow-3xl group-hover:scale-[1.02] backdrop-blur-sm">
              <div className="aspect-[16/10] bg-gradient-to-br from-cyan-100 via-blue-50 to-purple-100 rounded-2xl flex items-center justify-center relative overflow-hidden max-w-6xl mx-auto border border-gray-200/30">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Enhanced Mock Editor Preview */}
                <div className="relative z-10 text-center space-y-6">
                  <div className="flex justify-center items-center gap-6">
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-cyan-200/50">
                      <Sparkles className="w-10 h-10 text-cyan-500" />
                    </div>
                    <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform border border-blue-200/50">
                      <Star className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-purple-200/50">
                      <Zap className="w-10 h-10 text-purple-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-700 font-semibold text-lg">Interactive Editor Preview</p>
                    <p className="text-gray-500 text-sm">Experience the power of AI-driven image editing</p>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <div className="w-16 h-3 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full shadow-lg"></div>
                    <div className="w-16 h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full shadow-lg"></div>
                    <div className="w-16 h-3 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full shadow-lg"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced floating accent elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-20 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute top-1/2 -left-8 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-15 blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
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

        @keyframes particleFloat {
          0%, 100% { 
            opacity: 0;
            transform: translateY(0px) scale(0);
          }
          50% { 
            opacity: 1;
            transform: translateY(-30px) scale(1);
          }
        }

        .animate-particle-float {
          animation: particleFloat 3s ease-in-out infinite;
        }

        @keyframes cardAppear {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-card-appear {
          animation: cardAppear 0.6s ease-out forwards;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
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